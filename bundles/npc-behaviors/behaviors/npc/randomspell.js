let rndSpell = null;

/**
 * Используется случайное заклинание в бою
 */
module.exports = {
  listeners: {
    spawn: (state) => function () {
      const spell = [
        'fireball', 'heal', 'plea', 'invisibility', 'detect_invisibility', 'paralysis',
        'ice_peak', 'lightning', 'acid', 'silence', 'poison'];

      const randomSpell = spell[Math.floor(Math.random() * spell.length)];
      rndSpell = state.SpellManager.get(randomSpell);
    },

    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      if ((this.getAttribute('health') / this.getMaxAttribute('health')) > 0.8) {
        return;
      }

      const target = [...this.combatants][0];

      if (!rndSpell.onCooldown(this) && rndSpell.hasEnoughResources(this)) {
        if (rndSpell.targetSelf === false) {
          rndSpell.execute(null, this, target);
        } else {
          rndSpell.execute(null, this, this);
        }
      }
    },
  },
};
