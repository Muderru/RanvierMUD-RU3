'use strict';

/**
 * Confirm new player name
 */
module.exports = (srcPath) => {
  const EventUtil = require(srcPath + 'EventUtil');
  return {
    event: state => (socket, args) => {
      const say = EventUtil.genSay(socket);
      const write  = EventUtil.genWrite(socket);

      write(`<bold>${args.name} еще не существует, желаете создать?</bold> <cyan>[д/н]</cyan> `);
      socket.once('data', confirmation => {
        say('');
        confirmation = confirmation.toString().trim().toLowerCase();

        if (!/[дн]/.test(confirmation)) {
          return socket.emit('player-name-check', socket, args);
        }

        if (confirmation === 'н') {
          say(`Как-нибудь в другой раз...`);
          return socket.emit('create-player', socket, args);
        }
        
        socket.emit('create-rname', socket, args);
 
      });
    }
  };
};
