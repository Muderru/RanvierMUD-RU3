const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    get: (state) => function (player) {
      Broadcast.sayAt(player, 'Вы попытались сорвать красный цветок, но тут на вас набросился огромный монстр, похожий на кролика-мутанта!');
      player.room.spawnNpc(state, 'newbie:bunny');
      player.removeItem(this);
    },
  },
};
