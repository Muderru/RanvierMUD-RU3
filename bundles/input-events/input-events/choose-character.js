'use strict';

const { Broadcast, Config, EventUtil, Logger } = require('ranvier');

/**
 * Account character selection event
 */
module.exports = {
  event: state => (socket, args) => {
    let account = args.account;

    const say = EventUtil.genSay(socket);
    const write = EventUtil.genWrite(socket);
    const pm = state.PlayerManager;

    say(`Добро пожаловать, ${account.username}! Сделайте ваш выбор.`);
    /*
    Player selection menu:
    * Can select existing player
    * Can create new (if less than 3 living chars)
    */

    // This just gets their names.
    const characters = account.characters.filter(currChar => currChar.deleted === false);
    const maxCharacters   = Config.get("maxCharacters");
    const canAddCharacter = characters.length < maxCharacters;

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
          socket.emit('create-player', socket, { account });
        },
      });
    }

    if (characters.length) {
      options.push({ display: "Войти в игру как:" });
      characters.forEach(char => {
        options.push({
          display: char.username,
          onSelect: async () => {
            let currentPlayer = pm.getPlayer(char.username);
            let existed = false;
            if (currentPlayer) {
              // kill old connection
              Broadcast.at(currentPlayer, 'Обнаружена попытка входа, выполняется переподключение...');
              currentPlayer.socket.end();

              // link new socket
              currentPlayer.socket = socket;
              Broadcast.at(currentPlayer, 'Восстановление соединения. Добро пожаловать!.');
              Broadcast.prompt(currentPlayer);

              currentPlayer.socket.emit('commands', currentPlayer);
              return;
            }

            currentPlayer = await state.PlayerManager.loadPlayer(state, account, char.username);
            currentPlayer.socket = socket;
            socket.emit('done', socket, { player: currentPlayer });
          },
        });
      });
    }


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
        say('<bold>Удалив аккаунт, вы также удалите всех персонажей на нем.</bold>');
        write(`<bold>Вы уверены, что хотите удалить этот аккаунт? </bold> <cyan>[д/н]</cyan> `);
          socket.once('data', confirmation => {
            say('');
            confirmation = confirmation.toString().trim().toLowerCase();

            if (!/[дн]/.test(confirmation)) {
              say('<b>Необходимо напечатать д для подтверждения или н для отмены.</b>');
              return socket.emit('choose-character', socket, args);
            }

            if (confirmation === 'н') {
              say('Удаление отменено.');
              return socket.emit('choose-character', socket, args);
            }

            say(`Удаление аккаунта <b>${account.username}...</b>`);
            account.deleteAccount();
            say('Аккаунт успешно удален, спасибо за игру.');
            socket.end();
          });
      },
    });

    options.push({
      display: 'Выйти',
      onSelect: () => socket.end(),
    });

    // Display options menu

    let optionI = 0;
    options.forEach((opt) => {
      if (opt.onSelect) {
        optionI++;
        say(`<cyan>[${optionI}]</cyan> ${opt.display}`);
      } else {
        say(`<bold>${opt.display}</bold>`);
      }
    });

    socket.write('`-> ');

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
