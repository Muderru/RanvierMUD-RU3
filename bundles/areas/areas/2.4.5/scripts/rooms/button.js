const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (args !== 'рычаг') {
        return Broadcast.sayAt(player, 'Что вы хотите нажать?');
      }

      Broadcast.sayAt(player, 'Вы нажали на рычаг.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажал на рычаг.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажала на рычаг.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажали на рычаг.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} нажало на рычаг.`, player);
      }

      const targetExit = player.room.getExits().find((exit) => exit.direction === 'запад');
      const targetRoom = state.RoomManager.getRoom(targetExit.roomId);

      Broadcast.sayAt(player.room, 'Дверь на западе начала поворачиваться.');
      player.room.unlockDoor(targetRoom);
      player.room.openDoor(targetRoom);
    },
  },
};
