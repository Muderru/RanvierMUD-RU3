'use strict';

const { Account, EventUtil } = require('ranvier');

/**
 * Account creation event
 */
module.exports = {
  event: (state) => (socket, name) => {
    const write = EventUtil.genWrite(socket);
    const say = EventUtil.genSay(socket);

    let newAccount = null;
    write(`<bold>Хотите чтобы название вашего аккаунта было ${name}?</bold> <cyan>[д/н]</cyan> `);

    socket.once('data', data => {
      data = data.toString('utf8').trim();

      data = data.toLowerCase();
      if (data === 'y' || data === 'yes' || data === 'да' || data === 'д') {
        say('Создаем аккаунт...');
        newAccount = new Account({
          username: name
        });

        return socket.emit('change-password', socket, {
          account: newAccount,
          nextStage: 'create-player'
        });
      } else if (data && data === 'n' || data === 'no' || data === 'нет' || data === 'н') {
        say("Попробуйте снова!");

        return socket.emit('login', socket);
      }

      return socket.emit('create-account', socket, name);
    });
  }
};
