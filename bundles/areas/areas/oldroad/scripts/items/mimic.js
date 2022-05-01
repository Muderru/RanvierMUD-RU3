const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    get: (state) => function (player) {
      if (player.room.id === 66815) {
        Broadcast.sayAt(player, 'Стоило только вам взять ключ, как откуда-то выскочил уродливый монстр!');
        player.room.spawnNpc(state, 'oldroad:66819');
      }
    },
  },
};
