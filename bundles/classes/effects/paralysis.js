'use strict';

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
    maxStacks: 1,
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
      Broadcast.sayAt(this.target, '<b><red>Ваши мышцы деревенеют.</red></b>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<b><red>Ваши мышцы возвращают подвижность.</red></b>');
    },

  }
};
