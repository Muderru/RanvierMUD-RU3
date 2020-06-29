'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect ice_peak.
 */
module.exports = {
  config: {
    name: 'окоченение',
    gender: 'neuter',
    description: 'Ваши конечности окоченели и онемели.',
    type: 'ice_peak',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.DEBUFF],
  modifiers: {
    attributes: {
      freedom: function (current) {
        return current - this.state.spellStrength;
      }
    }
  },
  listeners: {
    effectActivated: function () {
      Broadcast.sayAt(this.target, '<blue>Ваши конечности коченеют и немеют.</blue>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<blue>Ваши конечности перестали коченеть.</blue>');
    },

  }
};
