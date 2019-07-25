'use strict';

/**
 * Account character selection event
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const EventUtil = require(srcPath + 'EventUtil');
  const Config     = require(srcPath + 'Config');
  const Logger    = require(srcPath + 'Logger');

  return {
    event: state => (socket, args) => {
      let account = args.account;

      const say = EventUtil.genSay(socket);
      const write = EventUtil.genWrite(socket);

      /*
      Player selection menu:
      * Can select existing player
      * Can create new (if less than 3 living chars)
      */
      say("\r\n------------------------------");
      say("|      Выберите:");
      say("------------------------------");

      // This just gets their names.
      const characters = account.characters.filter(currChar => currChar.deleted === false);
      const maxCharacters   = Config.get("maxCharacters");
      const canAddCharacter = characters.length < maxCharacters;
      const canMultiplay    = Config.get("allowMultiplay");

      let options = [];

      // Configure account options menu
      options.push({
        display: 'Поменять пароль',
        onSelect: () => {
          socket.emit('change-password', socket, { account, nextStage: 'choose-character' });
        },
      });

      if (canAddCharacter) {
        options.push({
          display: 'Создать нового персонажа',
          onSelect: () => {
            handleMultiplaying();
            socket.emit('create-player', socket, { account });
          },
        });
      }

      if (characters.length) {
        options.push({ display: "Войти в игру как:" });
        characters.forEach(char => {
          options.push({
            display: char.username,
            onSelect: () => {
              handleMultiplaying(char)
                .then(() => {
                  const player = state.PlayerManager.loadPlayer(state, account, char.username);
                  player.socket = socket;
                  socket.emit('done', socket, { player });
                })
                .catch(err => {
                  Logger.warn(err);
                  say('Ошибка входа в игру. Пожалуйста свяжитесь с администратором.');
                  socket.emit('close');
                });
            },
          });
        });
      }

      /*
      If multiplaying is not allowed:
      * Check all PCs on this person's account
      * Kick any that are currently logged-in.
      * Otherwise, have them take over the session
      * if they are logging into a PC that is already on.
      */
      function handleMultiplaying(selectedChar) {
        if (!canMultiplay) {
          const kickIfMultiplaying = kickIfLoggedIn.bind(null, 'Персонаж заменен. Мультинг не разрешен.');
          const checkAllCharacters = [...characters].map(kickIfMultiplaying);
          return Promise.all(checkAllCharacters);
        } else if (selectedChar) {
          Logger.log("Multiplaying is allowed...");
          return kickIfLoggedIn("Заменено новым сеансом.", selectedChar);
        }
      }

      function kickIfLoggedIn(message, character) {
        const otherPlayer = state.PlayerManager.getPlayer(character.username);
        if (otherPlayer) {
          return bootPlayer(otherPlayer, message);
        }
        return Promise.resolve();
      }

      function bootPlayer(player, reason) {
        return new Promise((resolve, reject) => {
          try {
            player.save(() => {
              Broadcast.sayAt(player, reason);
              player.socket.on('close', resolve)
              const closeSocket = true;
              state.PlayerManager.removePlayer(player, closeSocket);
              Logger.warn(`Booted ${player.name}: ${reason}`);
            });
          } catch (err) {
            return reject('Failed to save and close player.');
          }
        });
      }

      options.push({ display: "" });

      if (characters.length) {
        options.push({
          display: 'Удалить персонажа',
          onSelect: () => {
            socket.emit('delete-character', socket, args);
          },
        });
      }

      options.push({
        display: 'Удалить аккаунт',
        onSelect: () => {
          say('<bold>Удалив аккаунт, вы также удалите всех персонажей на нем.</bold>')
          write(`<bold>Вы уверены, что хотите удалить этот аккаунт? </bold> <cyan>[д/н]</cyan> `);
            socket.once('data', confirmation => {
              say('');
              confirmation = confirmation.toString().trim().toLowerCase();

              if (!/[дн]/.test(confirmation)) {
                say('<b>Недопустимая опция</b>')
                return socket.emit('choose-character', socket, args);
              }

              if (confirmation === 'н') {
                say('Никого не надо удалять...');
                return socket.emit('choose-character', socket, args);
              }

              say(`Deleting account <b>${account.username}</b>`);
              account.deleteAccount();
              say('Аккаунт удален, спасибо за игру.');
              socket.end();
            });
        },
      });

      options.push({
        display: 'Выход',
        onSelect: () => socket.end(),
      });

      // Display options menu

      let optionI = 0;
      options.forEach((opt) => {
        if (opt.onSelect) {
          optionI++;
          say(`| <cyan>[${optionI}]</cyan> ${opt.display}`);
        } else {
          say(`| <bold>${opt.display}</bold>`);
        }
      });

      socket.write('|\r\n`-> ');

      socket.once('data', choice => {
        choice = choice.toString().trim();
        choice = parseInt(choice, 10) - 1;
        if (isNaN(choice)) {
          return socket.emit('choose-character', socket, args);
        }

        const selection = options.filter(o => !!o.onSelect)[choice];

        if (selection) {
          Logger.log('Selected ' + selection.display);
          return selection.onSelect();
        }

        return socket.emit('choose-character', socket, args);
      });
    }
  };
};
