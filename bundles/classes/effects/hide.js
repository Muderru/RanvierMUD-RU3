'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect hidden.
 */
module.exports = {
  config: {
    name: 'спрятаться',
    gender: 'female',
    description: 'Вы спрятались.',
    type: 'hide',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      hide: function (current) {
        return current + this.state.spellStrength;
      }
    }
  },
  listeners: {
    effectActivated: function () {
      Broadcast.sayAt(this.target, '<green>Вы сливаетесь с окружением.</green>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<green>Вы вновь заметны.</green>');
    },

  }
};
