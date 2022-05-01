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

      Broadcast.sayAt(player, 'Вы нажали на кнопку и опустились вниз.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажал на кнопку и опустился вниз.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажала на кнопку и опустилась вниз.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажали на кнопку и опустились вниз.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} нажало на кнопку и опустилось вниз.`, player);
      }

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('2.4.5:church');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
