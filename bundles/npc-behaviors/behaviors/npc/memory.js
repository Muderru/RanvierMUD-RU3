'use strict';

module.exports = {
  listeners: {
    updateTick: state => function () {
      if (this.isInCombat()) {
          const target = [...this.combatants][0];
          
          const effect = state.EffectFactory.create('memory', {}, {});

          effect.enemy = this;
          target.addEffect(effect);
          return;
      }
    }
  }
};
