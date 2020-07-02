'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect bash.
 */
module.exports = {
  config: {
    name: 'дезориентация',
    gender: 'female',
    description: 'Вы валяетесь беспомощно на земле.',
    type: 'bash',
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
      Broadcast.sayAt(this.target, '<red>Вы упали на землю!</red>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<red>Вы поднялись с земли.</red>');
    },

  }
};
