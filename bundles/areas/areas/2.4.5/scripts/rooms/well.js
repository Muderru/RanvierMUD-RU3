const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      Broadcast.sayAt(player, 'Вы спустились на дно колодца.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} спустился на дно колодца.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} спустилась на дно колодца.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} спустились на дно колодца.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} спустилось на дно колодца.`, player);
      }

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('2.4.5:well');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
