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

      write("<bold>Введите ваше имя в предложном падеже (думать о ком?)?</bold> ");
      socket.once('data', pname => {
        say('');
        pname = pname.toString().trim();

        const invalid = CommonFunctions.validateName(pname);

        if (invalid) {
          say(invalid);
          return socket.emit('create-pname', socket, args);
        }

        pname = pname[0].toUpperCase() + pname.slice(1);

        const exists = state.PlayerManager.exists(pname);

        if (exists) {
          say(`Это имя уже используется.`);
          return socket.emit('create-pname', socket, args);
        }

        args.pname = pname;
        socket.emit('create-gender', socket, args);
      });
    }
  };
};
