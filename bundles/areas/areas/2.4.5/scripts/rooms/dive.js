const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      Broadcast.sayAt(player, 'Вы нырнули ко дну.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.name} нырнул ко дну.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.name} нырнула ко дну.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.name} нырнули ко дну.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.name} нырнуло ко дну.`, player);
      }

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('2.4.5:sea_bottom');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
