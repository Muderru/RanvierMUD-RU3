module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 60) {
        return;
      }

      state.ChannelManager.get('say').send(state, this, 'Поздравляю! Ты будешь моим сотым покупателем!');
      state.ChannelManager.get('say').send(state, this, 'Только для тебя всё по специальной цене!');
    },
  },
};
