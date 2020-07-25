const { Broadcast, EffectFlag, Heal } = require('ranvier');

/**
 * Effect applied by Judge skill. Reduces damage done.
 */
module.exports = {
  config: {
    name: 'осуждение',
    gender: 'neuter',
    damageVerb: 'мучает',
    description: 'Урон вашей следующей атаки уменьшен.',
    type: 'skill:judge',
    unique: true,
    persists: false,
  },
  flags: [EffectFlag.DEBUFF],
  state: {
    reductionPercent: 0,
  },
  modifiers: {
    incomingDamage: (damage, current) => current,
    outgoingDamage(damage, currentAmount) {
      if (damage instanceof Heal || damage.attribute !== 'health') {
        return currentAmount;
      }

      const reduction = Math.round(currentAmount * (this.state.reductionPercent / 100));
      return currentAmount - reduction;
    },
  },
  listeners: {
    effectActivated() {
      Broadcast.sayAt(this.target, '<yellow>Божественное осуждение ослабляет вас.</yellow>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, '<yellow>Вы чувствуете, как ваши силы возвращаются.</yellow>');
    },

    hit() {
      this.remove();
    },
  },
};
