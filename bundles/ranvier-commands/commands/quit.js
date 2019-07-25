'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    usage: 'конец',
    aliases: [ "конец" ],
    command: (state) => (args, player) => {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, "Сейчас вы сражаетесь за свою жизнь!");
      }

      player.save(() => {
        Broadcast.sayAt(player, "До скорой встречи!");
          if (player.gender === 'male') {
            Broadcast.sayAtExcept(player.room, `${player.name} вышел из игры.`, player);
          } else if (player.gender === 'female') {
            Broadcast.sayAtExcept(player.room, `${player.name} вышла из игры.`, player);
          } else if (player.gender === 'plural') {
            Broadcast.sayAtExcept(player.room, `${player.name} вышли из игры.`, player);
          } else {
            Broadcast.sayAtExcept(player.room, `${player.name} вышло из игры.`, player);
          }
        player.socket.emit('close');
      });
    }
  };
};
