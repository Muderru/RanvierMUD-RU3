const { Logger, SkillFlag } = require('ranvier');
const { Random } = require('rando-js');
const Combat = require('../../../combat/lib/Combat');

/**
 * Поведение для использования умений заклинаний
 */
module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (this.hasAttribute('freedom') && this.getAttribute('freedom') < 0) {
        return;
      }

      if (Random.inRange(0, 100) <= 97) {
        return;
      }

      const capable = this.getBehavior('capable');

      const { skills } = capable;
      const { spells } = capable;
      const skillsNumber = skills.length;
      const spellsNumber = spells.length;

      if (skillsNumber === 0 && spellsNumber === 0) {
        return;
      }

      let target1 = null;
      let target2 = null;

      if (this.isInCombat()) {
        target1 = [...this.combatants][0];
        target2 = target1;

        const weaponDamage1 = Combat.getWeaponDamage(target1);
        let max1 = Combat.normalizeWeaponDamage(target1, weaponDamage1.max);

        for (const combatant of this.combatants) {
          const weaponDamage2 = Combat.getWeaponDamage(combatant);
          const max2 = Combat.normalizeWeaponDamage(combatant, weaponDamage2.max);
          if (max2 > max1) {
            target2 = combatant;
            max1 = max2;
          }
        }

        let assistTarget = this;
        for (const npc of this.room.npcs) {
          if (!npc.hasAttribute('health')) {
            continue;
          }

          if ((this.getAttribute('health') / this.getMaxAttribute('health'))
              > (npc.getAttribute('health') / npc.getMaxAttribute('health'))) {
            assistTarget = npc;
          }
        }

        for (const spell of spells) {
          if (this.hasEffectType('silence')) {
            return;
          }

          const currentSpell = state.SpellManager.get(spell);

          if (!currentSpell) {
            return Logger.verbose(`NPC [${this.name}] have invalide spell ${spell}.`);
          }

          if (currentSpell.targetSelf === false) {
            if (!currentSpell.onCooldown(this) && currentSpell.hasEnoughResources(this)) {
              if (Random.inRange(0, 100) <= 40) {
                if (this.getAttribute('detect_invisibility') < target1.getAttribute('invisibility') ||
                    this.getAttribute('detect_hide') < target1.getAttribute('hide')) {
                  return;
                }
                return currentSpell.execute(null, this, target1);
              }
              if (this.getAttribute('detect_invisibility') < target2.getAttribute('invisibility') ||
                  this.getAttribute('detect_hide') < target2.getAttribute('hide')) {
                return;
              }
              return currentSpell.execute(null, this, target2);
            }
          } else if ((assistTarget.getAttribute('health') / assistTarget.getMaxAttribute('health')) < 0.8) {
            if (!currentSpell.onCooldown(this) && currentSpell.hasEnoughResources(this)) {
              return currentSpell.execute(null, this, assistTarget);
            }
          }
        }

        for (const skill of skills) {
          const currentSkill = state.SkillManager.get(skill);

          if (!currentSkill) {
            return Logger.verbose(`NPC [${this.name}] have invalide skill ${skill}.`);
          }

          if (currentSkill.flags.includes(SkillFlag.PASSIVE)) {
            return Logger.verbose(`NPC [${this.name}] tried use passive skill ${skill}.`);
          }

          if (currentSkill.targetSelf === false) {
            if (!currentSkill.onCooldown(this) && currentSkill.hasEnoughResources(this)) {
              //умение 'спасти' не вписывается в общие правила, для него отдельные правила
              if (currentSkill.name === 'спасти') {
                if (assistTarget !== this) {
                  if (![...this.combatants].includes(assistTarget)) {
                    return currentSkill.execute(null, this, assistTarget);
                  } else {
                    return;
                  }
                } else {
                  return;
                }
              } else {
                if (Random.inRange(0, 100) <= 40) {
                  if (this.getAttribute('detect_invisibility') < target1.getAttribute('invisibility') ||
                      this.getAttribute('detect_hide') < target1.getAttribute('hide')) {
                    return;
                  }
                  return currentSkill.execute(null, this, target1);
                }
                if (this.getAttribute('detect_invisibility') < target2.getAttribute('invisibility') ||
                    this.getAttribute('detect_hide') < target2.getAttribute('hide')) {
                  return;
                }
                return currentSkill.execute(null, this, target2);
              }
            }
          } else if ((assistTarget.getAttribute('health') / assistTarget.getMaxAttribute('health')) < 0.8) {
            if (!currentSkill.onCooldown(this) && currentSkill.hasEnoughResources(this)) {
              return currentSkill.execute(null, this, assistTarget);
            }
          }
        }
      }
    },
  },
};
