const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      let nextRoom = null;
      if (player.room.id === 66709) {
        nextRoom = state.RoomManager.getRoom('spdfor:66742');
      } else if (player.room.id === 66710) {
        nextRoom = state.RoomManager.getRoom('spdfor:66743');
      } else if (player.room.id === 66712) {
        nextRoom = state.RoomManager.getRoom('spdfor:66744');
      } else if (player.room.id === 66737) {
        nextRoom = state.RoomManager.getRoom('spdfor:66745');
      }

      Broadcast.sayAt(player, 'Вы залезли на дерево.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.Name} залез на дерево.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.Name} залезла на дерево.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.Name} залезли на дерево.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.Name} залезло на дерево.`, player);
      }

      const look = state.CommandManager.get('look');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
