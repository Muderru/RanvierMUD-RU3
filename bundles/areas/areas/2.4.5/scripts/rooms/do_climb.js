const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      Broadcast.sayAt(player, 'Вы вскарабкались вверх по скалам.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} вскарабкался вверх по скалам.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} вскарабкалась вверх по скалам.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} вскарабкались вверх по скалам.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} вскарабкалось вверх по скалам.`, player);
      }

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('2.4.5:ravine');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
