const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.hasEffectType('speaking')) {
        return;
      }

      const questRef = 'tookland:34700';
      if (!state.QuestFactory.canStart(player, questRef)) {
        return;
      }

      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          'Приветствую, %player%. У меня есть работа для тебя. Хочешь подзаработать?',
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
