const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (!this.hasAttribute('detect_invisibility')) {
        return;
      }

      if (player.getAttribute('invisibility') > this.getAttribute('detect_invisibility')) {
        return;
      }

      Broadcast.sayAt(player, '');
      Broadcast.sayAt(player, 'Похоже, в этом доме не хотят видеть чужаков.');
      Broadcast.sayAt(player, 'Жена бригадира выставила вас за порог!');
      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('forvill:70513');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
