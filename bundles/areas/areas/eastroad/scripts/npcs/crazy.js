const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.hasEffectType('speaking')) {
        return;
      }

      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          'Ой! Молодуха! Проходи, я помогу тебе разродиться!',
        ],
        outputFn: (message) => {
          message = message.replace(/%player%/, player.name);
          state.ChannelManager.get('say').send(state, this, message);
        },
      });
      this.addEffect(speak);
    },

    take: (state) => function (player, item) {
      Broadcast.sayAt(player, 'Сумашедшая старуха начала нянчить мертвого младенца словно он живой.');
      state.ChannelManager.get('say').send(state, this, 'Спасибо тебе. Возьми эту книгу, по ней я в молодости изучала женскую анатомию.');

      let book = null;
      book = player.room.spawnItem(state, 'eastroad:10907');
      player.addItem(book);
      player.room.removeItem(book);
      Broadcast.sayAt(player, 'Повитуха дала вам книгу.');
    },

    playerLeave: (state) => function (player) {
      const speaking = this.effects.getByType('speaking');
      if (speaking) {
        speaking.remove();
      }
    },
  },
};
