const { Broadcast, EffectFlag } = require('ranvier');

/**
 * Эффект уменьшения урона.
 */
module.exports = {
  config: {
    name: 'слабость',
    gender: 'neuter',
    description: 'Ваш урон уменьшен.',
    type: 'weakness',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.DEBUFF],
  modifiers: {
    outgoingDamage(damage, current) {
      return current - this.state.spellStrength;
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<b><magenta>Ваши удары наносят теперь меньше урона.</magenta></b>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<b><green>Ваши удары теперь наносят нормальный урон.</green></b>');
    },
  },
};
