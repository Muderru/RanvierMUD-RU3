'use strict';

/**
 * Effect applied by Judge skill. Reduces damage done.
 */
module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Flag = require(srcPath + 'EffectFlag');
  const Heal = require(srcPath + 'Heal');

  return {
    config: {
      name: 'Осуждение',
      description: 'Урон вашей следующей атаки ослаблен.',
      type: 'skill:judge',
    },
    flags: [Flag.DEBUFF],
    state: {
      reductionPercent: 0
    },
    modifiers: {
      incomingDamage: (damage, current) => current,
      outgoingDamage: function (damage, currentAmount) {
        if (damage instanceof Heal || damage.attribute !== 'health') {
          return currentAmount;
        }

        const reduction = Math.round(currentAmount * (this.state.reductionPercent / 100));
        return currentAmount - reduction;
      },
    },
    listeners: {
      effectActivated: function () {
        Broadcast.sayAt(this.target, '<yellow>Святое осуждение ослабляет вас.</yellow>');
      },

      effectDeactivated: function () {
        Broadcast.sayAt(this.target, '<yellow>Вы чувствуете подъем сил.</yellow>');
      },

      hit: function () {
        this.remove();
      }
    }
  };
};
