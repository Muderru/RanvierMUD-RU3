const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Уменьшает возможность обнаружения спрятавшихся и невидимых
 */
module.exports = {
  config: {
    name: 'слепота',
    gender: 'neuter',
    description: 'Вы хуже замечаете замаскировавшихся и невидимых существ.',
    type: 'blind',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    attributes: {
      detect_invisibility(current) {
        return current - this.state.spellStrength;
      },
      detect_hide(current) {
        return current - this.state.spellStrength;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<red>Ваши глаза начали слезиться.</red>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<b>Ваши глаза перестали слезиться.</b>');
    },
  },
};
