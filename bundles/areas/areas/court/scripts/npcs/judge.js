module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 60) {
        return;
      }

      const silence = state.SpellManager.get('silence');
      state.ChannelManager.get('say').send(state, this, 'Тишина в зале!');
      silence.run(null, this, player);
    },
  },
};
