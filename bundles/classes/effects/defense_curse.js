const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Эффект уменьшения брони.
 */
module.exports = {
  config: {
    name: 'проклятие защиты',
    gender: 'neuter',
    description: 'Ваша броня уменьшена.',
    type: 'defense_curse',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.DEBUFF],
  modifiers: {
    attributes: {
      armor(current) {
        return current - this.state.spellStrength;
      },
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<b><red>Ваша броня начала истончаться.</red></b>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<b><yellow>Ваша броня вернулась в норму.</yellow></b>');
    },
  },
};
