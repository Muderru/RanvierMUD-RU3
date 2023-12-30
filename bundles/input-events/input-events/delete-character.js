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

    say("Выберите персонажа, которого вы желаете удалить.");

    const characters = account.characters.filter(currChar => currChar.deleted === false);

    let options = [];
    characters.forEach(char => {
      options.push({
        display: `<b>${char.username}</b>`,
        onSelect: () => {
          write(`<bold>Вы уверены, что хотите удалить <b>${char.username}</b>?</bold> <cyan>[д/н]</cyan> `);
          socket.once('data', confirmation => {
            confirmation = confirmation.toString().trim().toLowerCase();

            if (!/[дн]/.test(confirmation)) {
              say('<b>Необходимо напечатать д для подтверждения или н для отмены.</b>');
              return socket.emit('choose-character', socket, args);
            }

            if (confirmation === 'н') {
              say('Удаление отменено.');
              console.log(char);
              return socket.emit('choose-character', socket, args);
            }

            say(`Удаление персонажа ${char.username}`);
            account.deleteCharacter(char.username);
            say('Персонаж удален.');
            return socket.emit('choose-character', socket, args);
          });
        },
      });
    });

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
