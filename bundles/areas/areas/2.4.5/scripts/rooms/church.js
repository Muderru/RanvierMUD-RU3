const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if ((args === 'кнопку') || (args === 'кнопка')) {
      } else {
        return Broadcast.sayAt(player, 'Что вы хотите нажать?');
      }

      Broadcast.sayAt(player, 'Вы нажали на кнопку и поднялись наверх.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажал на кнопку и поднялся наверх.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажала на кнопку и поднялась наверх.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажали на кнопку и поднялись наверх.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} нажало на кнопку и поднялось наверх.`, player);
      }

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('2.4.5:attic');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
