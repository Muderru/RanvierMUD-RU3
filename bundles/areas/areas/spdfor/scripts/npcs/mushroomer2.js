const { Broadcast } = require('ranvier');

let questactive = true;

module.exports = {
  listeners: {
    spawn: (state) => function () {
      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          'Спасибо. Пожалуйста, помогите мне выбраться отсюда.',
        ],
        outputFn: (message) => {
          state.ChannelManager.get('say').send(state, this, message);
        },
      });
      this.addEffect(speak);
    },

    updateTick: (state) => function () {
      if (this.room.id !== 66735) {
        return;
      }

      state.ChannelManager.get('say').send(state, this, 'Спасибо тебе огромное.');
      state.ChannelManager.get('say').send(state, this, 'Я вижу ты исследуешь этот опасный лес.');
      state.ChannelManager.get('say').send(state, this, 'Когда я собирал грибы, то заметил подозрительных людей в чёрных мантиях.');
      state.ChannelManager.get('say').send(state, this, 'Они ушли на северо-запад и все время повторяли: \'Мать ночи\'.');
      state.ChannelManager.get('say').send(state, this, 'Может быть тебе эта информация пригодится, а меня заждались дома.');
      this.unfollow();
      this.room.removeNpc(this, true);
      state.MobManager.removeMob(this);
    },

    channelReceive: (state) => function (say, player, message) {
      if (message === 'помогу') {
        if (questactive) {
          state.ChannelManager.get('say').send(state, this, 'Хорошо. Я иду за тобой!');
          questactive = false;
          this.follow(player);
        }
      }
    },

    respawnTick: (state) => function () {
      if (questactive === false) {
        questactive = true;
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
