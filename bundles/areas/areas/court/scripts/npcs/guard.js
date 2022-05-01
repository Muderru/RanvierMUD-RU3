const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.isInCombat()) {
        return;
      }

      
      if (player.hasItem('court:40270')) {
        return;
      }

      state.ChannelManager.get('say').send(state, this, 'Эй! Ты чего здесь делаешь? Где твой пропуск?');

      this.initiateCombat(player);
    },
  },
};
