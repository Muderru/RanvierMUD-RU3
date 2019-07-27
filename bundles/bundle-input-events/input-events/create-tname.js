'use strict';

const { EventUtil } = require('ranvier');
const CommonFunctions = require('../lib/CommonFunctions');

/**
 * Player creation event
 */
module.exports = {
  event : (state) => (socket, args) => {
    const say    = EventUtil.genSay(socket);
    const write  = EventUtil.genWrite(socket);

      write("<bold>Введите ваше имя в творительном падеже (доволен кем?)?</bold> ");
      socket.once('data', tname => {
        say('');
        tname = tname.toString().trim();

        const invalid = CommonFunctions.validateName(tname);

        if (invalid) {
          say(invalid);
          return socket.emit('create-tname', socket, args);
        }

        tname = tname[0].toUpperCase() + tname.slice(1);

        const exists = state.PlayerManager.exists(tname);

        if (exists) {
          say(`Это имя уже используется.`);
          return socket.emit('create-tname', socket, args);
        }

        args.tname = tname;
        socket.emit('create-pname', socket, args);
    });
  }
};
