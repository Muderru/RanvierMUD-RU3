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
      freedom(current) {
        return current - this.state.spellStrength;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<blue>Ваши конечности коченеют и немеют.</blue>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<blue>Ваши конечности перестали коченеть.</blue>');
    },

  },
};
