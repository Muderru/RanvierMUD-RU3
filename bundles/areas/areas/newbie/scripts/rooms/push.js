const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (!args || args !== 'кнопку') {
        return Broadcast.sayAt(player, 'Что вы хотите нажать?');
      }

      Broadcast.sayAt(player, 'Вы нажали кнопку.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажал кнопку.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажала кнопку.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} нажали кнопку.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} нажало кнопку.`, player);
      }

      let nextRoom = null;
      nextRoom = state.RoomManager.getRoom('newbie:tree');
      player.room.unlockDoor(nextRoom);
      return player.room.openDoor(nextRoom);
    },
  },
};
