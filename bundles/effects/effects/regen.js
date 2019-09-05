'use strict';

const { Damage, EffectFlag, Heal } = require('ranvier');

module.exports = {
  config: {
    name: 'Регенерация',
    description: "Ваши раны затягиваются сами по себе.",
    type: 'regen',
    tickInterval: 3
  },
  flags: [EffectFlag.BUFF],
  state: {
    magnitude: 10,
  },
  listeners: {
    updateTick: function () {
      // pools that regenerate over time
      const regens = [
        { pool: 'health', modifier: this.target.isInCombat() ? 0 : 1 },
        // energy and mana recovers 50% faster than health
        { pool: 'mana', modifier: this.target.isInCombat() ? 0.25 : 1.5 },
      ];

      for (const regen of regens) {
        if (!this.target.hasAttribute(regen.pool)) {
          continue;
        }

        const poolMax = this.target.getMaxAttribute(regen.pool);
        const amount = Math.round((poolMax / 10) * regen.modifier);
        const heal = new Heal(regen.pool, amount, this.target, this, {
          hidden: true,
        });
        heal.commit(this.target);
      }
    },
  }
};
