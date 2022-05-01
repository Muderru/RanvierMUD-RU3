module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.hasEffectType('speaking')) {
        return;
      }

      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          'Подайте на пропитание ветерану войны!',
        ],
        outputFn: (message) => {
          message = message.replace(/%player%/, player.name);
          state.ChannelManager.get('say').send(state, this, message);
        },
      });

      let rand = 0;
      rand = Math.floor((Math.random() * 100) + 1);
      if (rand > 60) {
        this.addEffect(speak);
      }
    },

    playerLeave: (state) => function (player) {
      const speaking = this.effects.getByType('speaking');
      if (speaking) {
        speaking.remove();
      }
    },
  },
};
