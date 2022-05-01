module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 60) {
        return;
      }

      state.ChannelManager.get('say').send(state, this, 'О, гости! Проходите, будьте как дома.');
      state.ChannelManager.get('say').send(state, this, 'Извините, ничем не могу вас угостить. Вся еда у меня закончилась.');
    },
  },
};
