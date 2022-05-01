module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.hasEffectType('speaking')) {
        return;
      }

      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          'Хозяин совсем ошалел, велел дыру в заборе заделать.',
          'О ней и не знает никто.',
          'Только если за колючий куст заползти, тогда в нее проползти можно.',
          'Но какой же дурак туда полезет?',
        ],
        outputFn: (message) => {
          message = message.replace(/%player%/, player.name);
          state.ChannelManager.get('say').send(state, this, message);
        },
      });
      this.addEffect(speak);
    },

    updateTick: (state) => function () {
      if (this.isInCombat()) {
        return;
      }

      if (this.room.players.size < 1) {
        return;
      }

      if (this.effects.getByType('speaking')) {
        return;
      }

      state.ChannelManager.get('say').send(state, this, 'Чужак! Бей его!');
      this.initiateCombat([...this.room.players][0]);
    },

    playerLeave: (state) => function (player) {
      const speaking = this.effects.getByType('speaking');
      if (speaking) {
        speaking.remove();
      }
    },
  },
};
