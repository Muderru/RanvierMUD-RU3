'use strict';

module.exports = {
  listeners: {
    updateTick: state => function () {
      if (this.isInCombat()) {
        const target = [...this.combatants][0];
        const enemyName = target.name;

        const effect = state.EffectFactory.create('memory', {}, {
            enemyName
          });

        this.addEffect(effect);
        return;
      }
    }
  }
};
