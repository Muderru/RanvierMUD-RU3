const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName === 'залезть' || commandName === 'лезть') {
        if (args !== 'на дерево') {
          return Broadcast.sayAt(player, 'Куда вы хотите залезть?');
        }

        Broadcast.sayAt(player, 'Вы залезли по лестнице на дерево.');
        let ending = '';
        if (player.gender === 'male') {
          ending = '';
        } else if (player.gender === 'female') {
          ending = 'ла';
        } else if (player.gender === 'plural') {
          ending = 'ли';
        } else {
          ending = 'ло';
        }
        Broadcast.sayAtExcept(player.room, `${player.Name} залез${ending} на дерево.`, player);

        let nextRoom = null;
        const look = state.CommandManager.get('look');
        nextRoom = state.RoomManager.getRoom('oldroad:66830');
        player.moveTo(nextRoom);
        look.execute(null, player, null);
      }
    },
  },
};
