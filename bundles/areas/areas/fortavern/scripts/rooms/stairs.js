const { Broadcast, Damage } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player, prevRoom) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 20) {
        return;
      }

      Broadcast.sayAt(player, '<bold><red>Вы с криком сорвались вниз!</red></bold>');
      Broadcast.sayAt(player, '');

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('fortavern:80134');
      player.moveTo(nextRoom);
      look.execute(null, player, null);

      const damage = new Damage('health', 50, null, this);
      damage.commit(player);
    },
  },
};
