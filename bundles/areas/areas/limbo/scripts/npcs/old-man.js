module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.hasEffectType('speaking')) {
        return;
      }

      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          'Добро пожаловать, %player%. Боевая тренировочная площадка находится на востоке.',
          'На западе ты найдешь магазинчик Вэлла, где можешь купить зелья.',
          'Тебе нужно найти учителей, чтобы выучить умения и заклинания.',
          'Набери <b><cyan>справка учителя</cyan></b>, чтобы узнать больше.',
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
