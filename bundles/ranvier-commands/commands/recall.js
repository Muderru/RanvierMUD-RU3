'use strict';

module.exports = srcPath => {
  const B = require(srcPath + 'Broadcast');

  return {
    usage: 'возврат',
    aliases: [ "возврат" ],
    command: state => (args, player) => {
      const home = player.getMeta('waypoints.home');
      if (!home) {
        return B.sayAt(player, 'У вас нет домашнего путеводного портала.');
      }

      B.sayAt(player, '<b><cyan>Вы помолились богам о возвращении домой и вас ослепило голубое сияние.</cyan></b>');
      if (player.gender === 'male') {
        B.sayAtExcept(player.room, `<b><cyan>${player.name} исчез в спышке голубого света.</cyan></b>`, [player]);
      } else if (player.gender === 'female') {
        B.sayAtExcept(player.room, `<b><cyan>${player.name} исчезла в спышке голубого света.</cyan></b>`, [player]);
      } else if (player.gender === 'plural') {
        B.sayAtExcept(player.room, `<b><cyan>${player.name} исчезли в спышке голубого света.</cyan></b>`, [player]);
      } else {
        B.sayAtExcept(player.room, `<b><cyan>${player.name} исчезло в спышке голубого света.</cyan></b>`, [player]);
      }      

      const nextRoom = state.RoomManager.getRoom(home);
      player.moveTo(nextRoom, _ => {
        state.CommandManager.get('look').execute('', player);

        B.sayAt(player, '<b><cyan>Свет погас и вы обнаружили себя около портала.</cyan></b>');
      if (player.gender === 'male') {
        B.sayAtExcept(player.room, `<b><cyan>Руны портала вспыхнули и ${player.name} появился в спышке голубого света.</cyan></b>`, [player]);
      } else if (player.gender === 'female') {
        B.sayAtExcept(player.room, `<b><cyan>Руны портала вспыхнули и ${player.name} появилась в спышке голубого света.</cyan></b>`, [player]);
      } else if (player.gender === 'plural') {
        B.sayAtExcept(player.room, `<b><cyan>Руны портала вспыхнули и ${player.name} появились в спышке голубого света.</cyan></b>`, [player]);
      } else {
        B.sayAtExcept(player.room, `<b><cyan>Руны портала вспыхнули и ${player.name} появилось в спышке голубого света.</cyan></b>`, [player]);
      }

      });
    }
  };
};
