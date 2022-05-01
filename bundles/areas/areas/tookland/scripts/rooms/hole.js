const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (commandName !== 'залезть') {
        return Broadcast.sayAt(player, 'Что?');
      }

      if (args === 'в нору' || args === 'нора') {
        Broadcast.sayAt(player, 'Вы залезли в нору.');

        if (player.gender === 'male') {
          Broadcast.sayAtExcept(player.room, `${player.name} залез в нору.`, player);
        } else if (player.gender === 'female') {
          Broadcast.sayAtExcept(player.room, `${player.name} залезла в нору.`, player);
        } else if (player.gender === 'plural') {
          Broadcast.sayAtExcept(player.room, `${player.name} залезли в нору.`, player);
        } else {
          Broadcast.sayAtExcept(player.room, `${player.name} залезло в нору.`, player);
        }

        let nextRoom = null;
        const look = state.CommandManager.get('look');
        nextRoom = state.RoomManager.getRoom('tookland:34781');
        player.moveTo(nextRoom);
        look.execute(null, player, null);
      } else {
        return Broadcast.sayAt(player, 'Куда вы хотите залезть?');
      }
    },
  },
};
