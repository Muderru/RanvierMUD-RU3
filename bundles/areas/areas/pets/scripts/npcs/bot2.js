const { Broadcast, Logger } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (this.isInCombat()) {
        return;
      }

      const bot = Array.from(this.room.npcs).find((npc) => npc.entityReference === 'pets:balance_bot1');
      if (bot) {
        this.initiateCombat(bot);
      }
    },

    killed: (state) => function (killer) {
      const healthCurrent = killer.getAttribute('health');
      const healthMax = killer.getMaxAttribute('health');
      const ratio = 100 * healthCurrent / healthMax;
      state.ChannelManager.get('say').send(state, this, `Убит, у бота 1 осталось ${ratio}% жизни.`);
    },
  },
};
