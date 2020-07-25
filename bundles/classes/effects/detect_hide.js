const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect detect hidden.
 */
module.exports = {
  config: {
    name: 'чувствовать жизнь',
    description: 'Вы замечаете спрятавшихся.',
    type: 'detect_hide',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      detect_hide(current) {
        return current + this.state.spellStrength;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<magenta>Вы начинаете замечать спрятавшихся.</magenta>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<magenta>Вы больше не замечаете спрятавшихся.</magenta>');
    },

  },
};
