const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (args !== 'руку') {
        return Broadcast.sayAt(player, 'Что вы хотите нажать?');
      }

      Broadcast.sayAt(player, 'Вы нажали на руку скелета.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажал на руку скелета.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажала на руку скелета.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажали на руку скелета.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} нажало на руку скелета.`, player);
      }

      const targetExit = player.room.getExits().find((exit) => exit.direction === 'вниз');
      const targetRoom = state.RoomManager.getRoom(targetExit.roomId);

      Broadcast.sayAt(player.room, 'В замке люка раздался щелчок и он открылся.');
      player.room.unlockDoor(targetRoom);
      player.room.openDoor(targetRoom);
    },
  },
};
