'use strict';

/**
 * Player creation event
 */
module.exports = (srcPath) => {
  const EventUtil = require(srcPath + 'EventUtil');
  const CommonFunctions = require('../lib/CommonFunctions');

  return {
    event : (state) => (socket, args) => {
      const say    = EventUtil.genSay(socket);
      const write  = EventUtil.genWrite(socket);

      write("<bold>Введите ваше имя в дательном падеже (дать кому?)?</bold> ");
      socket.once('data', dname => {
        say('');
        dname = dname.toString().trim();

        const invalid = CommonFunctions.validateName(dname);

        if (invalid) {
          say(invalid);
          return socket.emit('create-dname', socket, args);
        }

        dname = dname[0].toUpperCase() + dname.slice(1);

        const exists = state.PlayerManager.exists(dname);

        if (exists) {
          say(`Это имя уже используется.`);
          return socket.emit('create-dname', socket, args);
        }

        args.dname = dname;
        socket.emit('create-vname', socket, args);
      });
    }
  };
};
