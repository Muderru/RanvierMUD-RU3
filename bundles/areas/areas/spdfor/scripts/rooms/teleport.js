const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (!player.hasItem('spdfor:66716')) {
        return Broadcast.sayAt(player, 'Скатиться с холма?! Да, вы разобьетесь насмерть, спуск слишком крутой.');
      }

      Broadcast.sayAt(player, 'Вы уселись на кусок коры и покатились с холма, вопя от радости.');
      Broadcast.sayAt(player, 'В конце пути вы провалились под землю.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.Name} уселся на кусок коры и покатился с холма, вопя от радости.`, player);
        Broadcast.sayAtExcept(player.room, 'В конце пути он провалился под землю.', player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.Name} уселась на кусок коры и покатилась с холма, вопя от радости.`, player);
        Broadcast.sayAtExcept(player.room, 'В конце пути она провалился под землю.', player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.Name} уселись на кусок коры и покатились с холма, вопя от радости.`, player);
        Broadcast.sayAtExcept(player.room, 'В конце пути они провалился под землю.', player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.Name} уселось на кусок коры и покатилось с холма, вопя от радости.`, player);
        Broadcast.sayAtExcept(player.room, 'В конце пути оно провалился под землю.', player);
      }

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('spdfor:66730');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
