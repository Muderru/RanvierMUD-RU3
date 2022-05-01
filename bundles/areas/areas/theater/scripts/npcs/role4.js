const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    spawn: (state) => function () {
      state.ChannelManager.get('say').send(state, this, 'Любовь,');
      state.ChannelManager.get('say').send(state, this, 'Которая искать ее велела...');
      state.ChannelManager.get('say').send(state, this, 'Она совет дала мне, я - глаза ей -');
      state.ChannelManager.get('say').send(state, this, 'Я не моряк, но будь ты далеко,');
      state.ChannelManager.get('say').send(state, this, 'Как твердая земля за дальним морем,');
      state.ChannelManager.get('say').send(state, this, 'Пустился б за таким товаром я.');
    },

    channelReceive: (state) => function (say, player, message) {
      if (message === 'Ты знаешь, маска тьмы теперь скрывает лицо мое, а то бы на щеках ты девичьего стыда увидел краску.') {
        player.room.removeNpc(this, true);
        player.room.spawnNpc(state, 'theater:47738');
        player.room.spawnNpc(state, 'theater:47740');
        const questRef = 'theater:47700';
        if (state.QuestFactory.canStart(player, questRef)) {
          const quest = state.QuestFactory.create(state, questRef, player);
          player.questTracker.start(quest);
        }
      }
    },
  },
};
