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
      Broadcast.sayAt(this.target, '<magenta>Вы сливаетесь с окружением.</magenta>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<magenta>Вы вновь заметны.</magenta>');
    },

  }
};
