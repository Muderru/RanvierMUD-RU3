const { EffectFlag, Heal } = require('ranvier');

module.exports = {
  config: {
    name: 'Регенерация',
    persists: false,
    description: 'Ваши раны затягиваются сами по себе.',
    type: 'regen',
    tickInterval: 3,
  },
  flags: [EffectFlag.BUFF],
  state: {
    magnitude: 10,
  },
  listeners: {
    updateTick() {
      // pools that regenerate over time
      const regens = [
        { pool: 'health', modifier: this.target.hasAttribute('health_regeneration') ? this.target.getAttribute('health_regeneration') : 1 },
        // energy and mana recovers 100% faster than health
        { pool: 'mana', modifier: this.target.hasAttribute('mana_regeneration') ? this.target.getAttribute('mana_regeneration') : 2 },
      ];

      for (const regen of regens) {
        if (!this.target.hasAttribute(regen.pool)) {
          continue;
        }

        const amount = regen.modifier;
        const heal = new Heal(regen.pool, amount, this.target, this, {
          hidden: true,
        });
        heal.commit(this.target);
      }
    },
  },
};
