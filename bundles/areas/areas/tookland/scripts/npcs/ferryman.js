module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      state.ChannelManager.get('say').send(state, this, 'Переправлю через реку! Всего за 100 монет.');
    },
  },
};
