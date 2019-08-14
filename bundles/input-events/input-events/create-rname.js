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

      write("<bold>Введите ваше имя в родительном падеже (труп кого?)?</bold> ");
      socket.once('data', rname => {
        say('');
        rname = rname.toString().trim();

        const invalid = CommonFunctions.validateName(rname);

        if (invalid) {
          say(invalid);
          return socket.emit('create-rname', socket, args);
        }

        rname = rname[0].toUpperCase() + rname.slice(1);

        const exists = state.PlayerManager.exists(rname);

        if (exists) {
          say(`Это имя уже используется.`);
          return socket.emit('create-rname', socket, args);
        }

        args.rname = rname;
        socket.emit('create-dname', socket, args);
    });
  }
};
