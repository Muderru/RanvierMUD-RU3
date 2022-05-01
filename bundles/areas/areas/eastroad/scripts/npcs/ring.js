const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    take: (state) => function (player, item) {
      state.ChannelManager.get('say').send(state, this, 'Ха, спасибо. Вот, держи моё сокровище.');

      let key = null;
      key = player.room.spawnItem(state, 'eastroad:10905');
      player.addItem(key);
      player.room.removeItem(key);
      Broadcast.sayAt(player, 'Орк-мародер дал вам ключ.');
    },
  },
};
