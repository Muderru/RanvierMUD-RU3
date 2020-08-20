const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Эффект увеличения брони.
 */
module.exports = {
  config: {
    name: 'защита',
    gender: 'female',
    description: 'Ваша кожа напоминает кору.',
    type: 'defense',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      armor(current) {
        return current + this.state.spellStrength;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<b><yellow>Ваша кожа начинает напоминать кору.</yellow></b>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<b><yellow>Ваша кожа перестала напоминать кору.</yellow></b>');
    },
  },
};
