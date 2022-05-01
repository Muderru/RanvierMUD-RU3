module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 60) {
        return;
      }

      state.ChannelManager.get('say').send(state, this, 'Подайте на пропитание старому ветерану.');
    },
  },
};
