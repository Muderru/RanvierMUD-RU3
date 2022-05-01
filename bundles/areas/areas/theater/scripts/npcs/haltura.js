module.exports = {
  listeners: {
    spawn: (state) => function () {
      state.ChannelManager.get('say').send(state, this, 'Халтура! Такую игру невозможно терпеть!');
    },
  },
};
