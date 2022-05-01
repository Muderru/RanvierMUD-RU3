module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 10) {
        return;
      }

      if (player.gender === 'male') {
        state.ChannelManager.get('say').send(state, this, 'Я слежу за тобой, незнакомец!');
      } else {
        state.ChannelManager.get('say').send(state, this, 'Я слежу за тобой, незнакомка!');
      }
    },
  },
};
