const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect paralysis.
 */
module.exports = {
  config: {
    name: 'паралич',
    gender: 'male',
    description: 'Ваши мышцы менее подвижны.',
    type: 'paralysis',
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
      Broadcast.sayAt(this.target, '<b><red>Ваши мышцы деревенеют.</red></b>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<b><red>Ваши мышцы возвращают подвижность.</red></b>');
    },

  },
};
