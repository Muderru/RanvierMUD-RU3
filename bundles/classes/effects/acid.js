'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect acid.
 */
module.exports = {
  config: {
    name: 'ржавчина',
    gender: 'female',
    description: 'Ваша броня уменьшена.',
    unique: true,
    persists: false,
    refreshes: true,
    type: 'acid',
  },
  flags: [EffectFlag.DEBUFF],
  modifiers: {
    attributes: {
      armor: function (current) {
        return current - this.state.spellStrength;
      }
    }
  },
  listeners: {
    effectActivated: function () {
      Broadcast.sayAt(this.target, '<yellow>Ваша броня покрывается ржавчиной.</yellow>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<yellow>Вашу броню перестала покрывать ржавчина.</yellow>');
    },

  }
};
