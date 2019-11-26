'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect invisibility.
 */
module.exports = {
  config: {
    name: 'свет',
    gender: 'male',
    description: 'Вы светитесь.',
    type: 'light',
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      light: function (current) {
        return current + this.state.spellStrength;
      }
    }
  },
  listeners: {
    effectActivated: function () {
      Broadcast.sayAt(this.target, '<b>Вы начинаете светиться.</b>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<b>Вы перестаете светиться.</b>');
    },

  }
};
