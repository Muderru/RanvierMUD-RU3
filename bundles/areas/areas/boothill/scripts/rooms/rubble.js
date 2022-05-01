const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      Broadcast.sayAt(player, 'Вы протиснулись сквозь камни завала.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} протиснулся сквозь камни завала.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} протиснулась сквозь камни завала.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} протиснулись сквозь камни завала.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} протиснулось сквозь камни завала.`, player);
      }

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('boothill:mntpath');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
