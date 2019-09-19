'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect detect hidden.
 */
module.exports = {
  config: {
    name: 'чувствовать жизнь',
    description: 'Вы замечаете спрятавшихся.',
    type: 'detect_hide',
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      detect_hide: function (current) {
        return current + this.state.spellStrength;
      }
    }
  },
  listeners: {
    effectActivated: function () {
      Broadcast.sayAt(this.target, '<magenta>Вы начинаете замечать спрятавшихся.</magenta>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<magenta>Вы больше не замечаете спрятавшихся.</magenta>');
    },

  }
};
