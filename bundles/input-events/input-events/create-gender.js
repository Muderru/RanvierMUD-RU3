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

      write("<bold>Пол вашего персонажа (мужской/женский)?</bold> ");
      socket.once('data', gender => {
        say('');
        gender = gender.toString().trim().toLowerCase();
 
        if (gender === 'м' || gender === 'муж' || gender === 'мужской') {
            args.gender = 'male';
            return socket.emit('choose-class', socket, args);
        }

        if (gender === 'ж' || gender === 'жен' || gender === 'женский') {
            args.gender = 'female';
            return socket.emit('choose-class', socket, args);
        } 
        
        socket.emit('create-gender', socket, args);
        
    });
  }
};
