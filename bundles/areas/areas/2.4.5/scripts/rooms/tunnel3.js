const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (!player.hasItem('2.4.5:rope')) {
        return Broadcast.sayAt(player, 'Вам нужна верёвка для этого.');
      }

      Broadcast.sayAt(player, 'Вы спустились вниз по веревке.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} спустился вниз по веревке.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} спустилась вниз по веревке.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} спустились вниз по веревке.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} спустилось вниз по веревке.`, player);
      }

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('2.4.5:mine_tunnel8');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
