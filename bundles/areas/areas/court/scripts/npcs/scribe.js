const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player, prevRoom) {
      if (prevRoom.id === 40210) {
        Broadcast.sayAt(player, 'Писец подозрительно взглянул на вас, но ничего не сказал.');
      }
    },
  },
};
