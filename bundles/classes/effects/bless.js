const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Эффект увеличения урона.
 */
module.exports = {
  config: {
    name: 'благословение',
    gender: 'neuter',
    description: 'Ваш урон увеличен.',
    type: 'bless',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
  modifiers: {
    outgoingDamage(damage, current) {
      return current + this.state.spellStrength;
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<b>Ваши удары теперь сокрушают нечестивых!</b>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<b><magenta>Вы больше не сокрушаете нечестивых.</magenta></b>');
    },
  },
};
