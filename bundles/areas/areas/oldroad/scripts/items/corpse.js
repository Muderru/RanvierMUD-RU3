const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (this.room.players.size < 1) {
        return;
      }

      const random = Math.random() * 100;
      if (random > 0.2) {
        return;
      }

      Broadcast.sayAt(this.room, 'Подвешенный труп качнуло ветром.');
    },
  },
};
