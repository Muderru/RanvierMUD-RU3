const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (args === 'в дыру' || args === 'дыра' || args === 'в нору' || args === 'нора') {
        Broadcast.sayAt(player, 'Вы залезли в дыру.');

        if (player.gender === 'male') {
          Broadcast.sayAtExcept(player.room, `${player.name} залез в дыру.`, player);
        } else if (player.gender === 'female') {
          Broadcast.sayAtExcept(player.room, `${player.name} залезла в дыру.`, player);
        } else if (player.gender === 'plural') {
          Broadcast.sayAtExcept(player.room, `${player.name} залезли в дыру.`, player);
        } else {
          Broadcast.sayAtExcept(player.room, `${player.name} залезло в дыру.`, player);
        }

        let nextRoom = null;
        const look = state.CommandManager.get('look');
        nextRoom = state.RoomManager.getRoom('fortavern:80128');
        player.moveTo(nextRoom);
        look.execute(null, player, null);
      } else {
        return Broadcast.sayAt(player, 'Куда вы хотите залезть?');
      }
    },

    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 60) {
        return;
      }

      Broadcast.sayAt(player, 'За стеной послышался крысиный писк.');
    },
  },
};
