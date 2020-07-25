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
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      light(current) {
        return current + this.state.spellStrength;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<b><yellow>Вы начинаете светиться.</yellow></b>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<b><yellow>Вы перестаете светиться.</yellow></b>');
    },

  },
};
