const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.isInCombat()) {
        return;
      }

      if (!player.hasEquippedItem('spdfor:66740')) {
        const nextRoom = state.RoomManager.getRoom('spdfor:66746');
        Broadcast.sayAt(player, 'Решетка не пропускает вас.');
        const look = state.CommandManager.get('look');
        player.moveTo(nextRoom);
        return look.execute(null, player, null);
      }

      Broadcast.sayAt(player, 'Стражник поднял решетку и пропустил вас.');
    },
  },
};
