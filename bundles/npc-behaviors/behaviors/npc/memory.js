'use strict';

const { Random } = require('rando-js');
const { Broadcast, Logger } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: state => function () {
      if (this.isInCombat()) {
          const target = [...this.combatants][0];
          
          const effect = state.EffectFactory.create('memory', {}, {});
          effect.playertarget = target;
          effect.owner = this;
          this.addEffect(effect);
          return;
      }

      
    }
  }
};
