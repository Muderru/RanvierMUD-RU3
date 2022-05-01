const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    channelReceive: (state) => function (say, player, message) {
      if (message !== 'Мать ночи') {
        return;
      }

      player.room.exits.push({ roomId: 'spdfor:66746', direction: 'вниз', inferred: true });
      Broadcast.sayAt(player.room, 'Доски пола разошлись в стороны, открыв проход вниз.');
    },

    respawnTick: (state) => function () {
      if (this.exits.length > 1) {
        this.exits.splice(1, 1);
      }
    },
  },
};
