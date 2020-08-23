let rndSkill = null;

/**
 * Используется случайное умение в бою, из-за простой логики можно
 * использовать только умения либо наносящие урон противнику, либо 
 * усиливающие себя.
 */
module.exports = {
  listeners: {
    spawn: (state) => function () {
      const skill = [
        'judge', 'lunge', 'rend', 'shieldblock', 'smite', 'hide',
        'detect_hide', 'bash', 'parry'];

      const randomSkill = skill[Math.floor(Math.random() * skill.length)];
      rndSkill = state.SkillManager.get(randomSkill);
    },

    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      if ((this.getAttribute('health') / this.getMaxAttribute('health')) > 0.8) {
        return;
      }

      const target = [...this.combatants][0];

      if (!rndSkill.onCooldown(this) && rndSkill.hasEnoughResources(this)) {
        if (rndSkill.targetSelf === false) {
          rndSkill.execute(null, this, target);
        } else {
          rndSkill.execute(null, this, this);
        }
      }
    },
  },
};
