'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect silence.
 */
module.exports = {
  config: {
    name: 'молчание',
    gender: 'neuter',
    description: 'Вы не можете колдовать.',
    type: 'silence',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.DEBUFF],
  modifiers: {
  },
  listeners: {
    effectActivated: function () {
      Broadcast.sayAt(this.target, '<b>Вы теряете возможность колдовать.</b>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<b>Вы вновь можете колдовать.</b>');
    },

  }
};
