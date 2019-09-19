'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect invisibility.
 */
module.exports = {
  config: {
    name: 'невидимость',
    gender: 'female',
    description: 'Вы невидимы.',
    type: 'invisibility',
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      invisibility: function (current) {
        return current + this.state.spellStrength;
      }
    }
  },
  listeners: {
    effectActivated: function () {
      Broadcast.sayAt(this.target, '<cyan>Вы растворяетесь в воздухе.</cyan>');
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, '<cyan>Вы вновь видимы.</cyan>');
    },

  }
};
