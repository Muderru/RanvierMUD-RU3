const { Random } = require('rando-js');
const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      if (Random.inRange(0, 100) <= 98) {
        return;
      }

      const poison = state.SpellManager.get('poison');
      const healthCurrent = this.getAttribute('health');
      const healthMax = this.getMaxAttribute('health');
      if ((healthCurrent / healthMax) < 0.5) {
        for (const pc of this.room.players) {
          Broadcast.sayAt(pc, '<red>Болотная тварь брызнула на вас ядовитой кровью!</red>');
          poison.run(null, this, pc);
        }
      }
    },
  },
};
