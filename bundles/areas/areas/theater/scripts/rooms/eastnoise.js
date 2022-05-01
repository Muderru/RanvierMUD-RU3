const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand <= 25) {
        Broadcast.sayAt(player, 'Из восточной лоджии послышался какой-то шум.');
      }
    },
  },
};
