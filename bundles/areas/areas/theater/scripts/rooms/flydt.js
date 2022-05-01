const { Broadcast, Damage } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player, prevRoom) {
      if (prevRoom.id === 47742) {
        Broadcast.sayAt(player, '<bold><red>Вы с криком сорвались вниз!</red></bold>');
        Broadcast.sayAt(player, '');

        let nextRoom = null;
        const look = state.CommandManager.get('look');
        nextRoom = state.RoomManager.getRoom('theater:47757');
        player.moveTo(nextRoom);
        look.execute(null, player, null);

        const damage = new Damage('health', 250, null, this);
        damage.commit(player);
      }
    },
  },
};
