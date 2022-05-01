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

      const paralysis = state.SpellManager.get('paralysis');
      const weakness = state.SpellManager.get('weakness');
      const silence = state.SpellManager.get('silence');

      const target = [...this.combatants][0];
      const rnd = Random.inRange(0, 100);
      if (rnd <= 33) {
        paralysis.run(null, this, target);
      } else if (rnd >= 66) {
        weakness.run(null, this, target);
      } else {
        silence.run(null, this, target);
      }
      this.removeFromCombat();
    },
  },
};
