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

      write("<bold>Введите ваше имя в винительном падеже (вижу кого?)?</bold> ");
      socket.once('data', vname => {
        say('');
        vname = vname.toString().trim();

        const invalid = CommonFunctions.validateName(vname);

        if (invalid) {
          say(invalid);
          return socket.emit('create-vname', socket, args);
        }

        vname = vname[0].toUpperCase() + vname.slice(1);

        const exists = state.PlayerManager.exists(vname);

        if (exists) {
          say(`Это имя уже используется.`);
          return socket.emit('create-vname', socket, args);
        }

        args.vname = vname;
        socket.emit('create-tname', socket, args);
      });
    }
  };
};
