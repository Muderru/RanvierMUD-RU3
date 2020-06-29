'use strict';

const { Broadcast, EffectFlag, Heal } = require('ranvier');

/**
 * Implementation effect for second wind skill
 */
module.exports = {
  config: {
    name: 'второе дыхание',
    gender: 'neuter',
    damageVerb: 'окрыляет',
    type: 'skill:secondwind'
  },
  flags: [EffectFlag.BUFF],
  listeners: {
    damaged: function (damage) {
      if (damage.attribute !== 'mana') {
        return;
      }

      if (this.skill.onCooldown(this.target)) {
        return;
      }

      if ((this.target.getAttribute('mana') / this.target.getMaxAttribute('mana')) * 100 > this.state.threshold) {
        return;
      }

      Broadcast.sayAt(this.target, "<bold><yellow>Вы ощутили второе дыхание!</bold></yellow>");
      const amount = Math.floor(this.target.getMaxAttribute('mana') * (this.state.restorePercent / 100));
      const heal = new Heal('mana', amount, this.target, this.skill);
      heal.commit(this.target);

      this.skill.cooldown(this.target);
    }
  }
};
