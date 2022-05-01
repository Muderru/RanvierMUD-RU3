const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    take: (state) => function (player, item) {
      state.ChannelManager.get('say').send(state, this, 'Ой, как мило! Вот держи.');

      let card = null;
      card = player.room.spawnItem(state, 'theater:47736');
      player.addItem(card);
      player.room.removeItem(card);
      Broadcast.sayAt(player, 'Прима дала вам карточку с автографом.');

      player.room.removeNpc(this, true);
      player.room.spawnNpc(state, 'theater:47732');
    },

    killed: (state) => function (killer) {
      state.ChannelManager.get('say').send(state, this, 'Звезда в шоке!.');
    },
  },
};
