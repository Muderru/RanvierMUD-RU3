const { Broadcast, Damage, EffectFlag } = require('ranvier');

/**
 * Implementation effect for a Rend damage over time skill
 */
module.exports = {
  config: {
    name: 'порез',
    gender: 'male',
    damageVerb: 'ранит',
    type: 'skill:rend',
    unique: true,
    persists: false,
    refreshes: true,
  },
  flags: [EffectFlag.DEBUFF],
  listeners: {
    effectStackAdded(newEffect) {
      // add incoming rend's damage to the existing damage but don't extend duration
      this.state.totalDamage += newEffect.state.totalDamage;
    },

    effectActivated() {
      Broadcast.sayAt(this.target, '<bold><red>Вы получили глубокую рану, она обильно кровоточит.</red></bold>');
    },

    effectDeactivated() {
      Broadcast.sayAt(this.target, 'Ваша рана перестала кровоточить.');
    },

    updateTick() {
      const amount = this.state.totalDamage;

      const damage = new Damage('health', amount, this.attacker, this);
      damage.commit(this.target);
    },

    killed() {
      this.remove();
    },
  },
};
