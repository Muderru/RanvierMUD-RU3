'use strict';

const { EventUtil, Logger } = require('ranvier');

/**
 * Delete character event
 */
module.exports = {
  event: state => (socket, args) => {
    let account = args.account;
    const say = EventUtil.genSay(socket);
    const write = EventUtil.genWrite(socket);

    say("\r\n------------------------------");
    say("|      Удалить персонажа");
    say("------------------------------");

    const characters = account.characters.filter(currChar => currChar.deleted === false);

    let options = [];
    characters.forEach(char => {
      options.push({
        display: `Delete <b>${char.username}</b>`,
        onSelect: () => {
          write(`<bold>Вы уверены, что хотите удалить <b>${char.username}</b>?</bold> <cyan>[д/н]</cyan> `);
          socket.once('data', confirmation => {
            say('');
            confirmation = confirmation.toString().trim().toLowerCase();

            if (!/[дн]/.test(confirmation)) {
              say('<b>Недопустимая опция</b>');
              return socket.emit('choose-character', socket, args);
            }

            if (confirmation === 'н') {
              say('Никто не удален...');
              return socket.emit('choose-character', socket, args);
            }

            say(`Deleting ${char.username}`);
            account.deleteCharacter(char.username);
            say('Персонаж удален.');
            return socket.emit('choose-character', socket, args);
          });
        },
      });
    });

    options.push({ display: "" });

    options.push({
      display: 'Возврат в главное меню',
      onSelect: () => {
        socket.emit('choose-character', socket, args);
      },
    });

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
