const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 60) {
        return;
      }

      Broadcast.sayAt(player, 'Большой аист агрессивно защелкал острым клювом.');
    },
  },
};
