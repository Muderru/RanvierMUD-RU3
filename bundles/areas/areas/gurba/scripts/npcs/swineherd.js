module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.hasEffectType('speaking')) {
        return;
      }

      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          'Приветствую, %player%. Если тебе негде переночевать, то можешь остановиться здесь.',
          'За символическую плату, конечно. Хе-хе.',
        ],
        outputFn: (message) => {
          message = message.replace(/%player%/, player.name);
          state.ChannelManager.get('say').send(state, this, message);
        },
      });
      this.addEffect(speak);
    },

    playerLeave: (state) => function (player) {
      const speaking = this.effects.getByType('speaking');
      if (speaking) {
        speaking.remove();
      }
    },
  },
};
