const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Effect detect invisibility.
 */
module.exports = {
  config: {
    name: 'видеть невидимое',
    gender: 'neuter',
    description: 'Вы видите невидимое.',
    type: 'detect_invisibility',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      detect_invisibility(current) {
        return current + this.state.spellStrength;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<cyan>Вы начинаете видеть невидимое.</cyan>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<cyan>Вы больше не видите невидимое.</cyan>');
    },

  },
};
