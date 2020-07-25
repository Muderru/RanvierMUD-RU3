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
      hide(current) {
        return current + this.state.spellStrength;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<green>Вы сливаетесь с окружением.</green>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<green>Вы вновь заметны.</green>');
    },

  },
};
