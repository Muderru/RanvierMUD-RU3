const { Broadcast } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

function attrMod(player, target, skillAttr) {
  let addDamage = 0;
  const damageAttr = `${skillAttr}_damage`;
  const resistanceAttr = `${skillAttr}_resistance`;
  if (player.hasAttribute(damageAttr)) {
    if (target.hasAttribute(resistanceAttr)) {
      if (player.getAttribute(damageAttr) > target.getAttribute(resistanceAttr)) {
        addDamage += player.getAttribute(damageAttr) - target.getAttribute(resistanceAttr);
      }
    } else {
      addDamage += player.getAttribute(damageAttr);
    }
  }
  addDamage = 1 + addDamage * 0.1;
  return addDamage;
}

function statMod(player, stat) {
  let addDamage = 0;
  if (player.hasAttribute(stat)) {
    addDamage += player.getAttribute(stat);
  } else {
    addDamage = 20;
  }

  addDamage = 1 + addDamage * 0.05;
  return addDamage;
}

function abilityMod(player, ability) {
  let addDamage = 0;
  if (player.getMeta(ability) > 0) {
    addDamage = player.getMeta(ability) * 0.01;
  }
  return 1 + addDamage;
}

function attrModHeal(player, skillAttr) {
  let addDamage = 0;
  const damageAttr = `${skillAttr}_damage`;
  if (player.hasAttribute(damageAttr)) {
    addDamage += player.getAttribute(damageAttr);
  }
  addDamage = 1 + addDamage * 0.05;
  return addDamage;
}

/**
 * Direct damage from skills
 */
exports.directSkillDamage = function (player, target, skillAttr, skillName) {
  let getDamage = 0;
  if (!player.isNpc) { // прямой урон игрока
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * attrMod(player, target, skillAttr)
                            * statMod(player, 'strength')
                            * abilityMod(player, `skill_${skillName}`)
                            * (1 + (player.getAttribute('skill_damage_percent') / 100)));
  } else { // прямой урон моба, его формула проще т.к. у него может не быть многих атрибутов
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * (1 + (player.level / 100))
                            * (1.5 + (player.getAttribute('skill_damage_percent') / 100)));
  }
  return getDamage;
};

/**
 * Direct damage from spells
 */
exports.directSpellDamage = function (player, target, skillAttr, skillName) {
  let getDamage = 0;
  if (!player.isNpc) { // прямой урон игрока
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * attrMod(player, target, skillAttr)
                            * statMod(player, 'intellect')
                            * abilityMod(player, `spell_${skillName}`)
                            * (1 + (player.getAttribute('spell_damage_percent') / 100)));
  } else { // прямой урон моба, его формула проще т.к. у него может не быть многих атрибутов
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * (1 + (player.level / 100))
                            * (1.5 + (player.getAttribute('spell_damage_percent') / 100)));
  }
  return getDamage;
};

/**
 * Direct heal amount from spells
 */
exports.directHealAmount = function (player, target, skillAttr, skillName) {
  let getDamage = 0;
  if (!player.isNpc) { // прямой урон игрока
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * attrModHeal(player, skillAttr)
                            * statMod(player, 'intellect')
                            * abilityMod(player, `spell_${skillName}`)
                            * (1 + (player.getAttribute('out_heal_percent') / 100))
                            * (1 + (target.getAttribute('in_heal_percent') / 100)));
  } else { // прямой урон моба, его формула проще т.к. у него может не быть многих атрибутов
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * (1 + (player.level / 100))
                            * (1.5 + (player.getAttribute('out_heal_percent') / 100))
                            * (1.5 + (target.getAttribute('in_heal_percent') / 100)));
  }
  return getDamage;
};

/**
 * Effects duration
 */
exports.effectDuration = function (player) {
  let duration = 6000;
  if (player.hasAttribute('agility')) {
    duration = 3000 * (1 + Math.floor(player.getAttribute('agility') / 5))
                    * (1 + (player.getAttribute('effect_duration_percent') / 100));
  }
  return duration;
};

/**
 * DOT duration
 */
exports.dotDuration = function (player, target) {
  let duration = 6000;
  if (player.hasAttribute('agility')) {
    duration = 3000 * (1 + Math.floor(player.getAttribute('agility') / 5))
                    * (1 + (player.getAttribute('dot_duration_percent') / 100))
                    * (1 - (target.getAttribute('dot_duration_reduction_percent') / 100));
  }
  return duration;
};

/**
 * DOT spell damage
 */
exports.dotSpellDamage = function (player, target, skillAttr, skillName) {
  let getDamage = 0;
  if (!player.isNpc) { // периодический урон игрока
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * attrMod(player, target, skillAttr)
                            * statMod(player, 'intellect')
                            * abilityMod(player, `spell_${skillName}`)
                            * (1 + (player.getAttribute('spell_damage_percent') / 100))
                            * (1 + (player.getAttribute('dot_damage_percent') / 100)));
  } else { // периодический урон моба, его формула проще т.к. у него может не быть многих атрибутов
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * (1 + (player.level / 100))
                            * (1.5 + (player.getAttribute('spell_damage_percent') / 100))
                            * (1 + (player.getAttribute('dot_damage_percent') / 100)));
  }
  return getDamage;
};

/**
 * DOT skill damage
 */
exports.dotSkillDamage = function (player, target, skillAttr, skillName) {
  let getDamage = 0;
  if (!player.isNpc) { // периодический урон игрока
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * attrMod(player, target, skillAttr)
                            * statMod(player, 'strength')
                            * abilityMod(player, `skill_${skillName}`)
                            * (1 + (player.getAttribute('skill_damage_percent') / 100))
                            * (1 + (player.getAttribute('dot_damage_percent') / 100)));
  } else { // периодический урон моба, его формула проще т.к. у него может не быть многих атрибутов
    getDamage = Math.floor(Combat.calculateWeaponDamage(player)
                            * (1 + (player.level / 100))
                            * (1.5 + (player.getAttribute('spell_damage_percent') / 100))
                            * (1 + (player.getAttribute('dot_damage_percent') / 100)));
  }
  return getDamage;
};

/**
 * Buff amount
 */
exports.getBuff = function (player, skillStat) {
  let buffStrength = 1;
  if (player.getMeta(skillStat) > 0) {
    buffStrength = player.getMeta(skillStat);
  }
  return buffStrength;
};

/**
 * Buff minion pet
 */
exports.minionBuff = function (player, minion, skillStat) {
  let buffStrength = 1;
  if (player.getMeta(skillStat) > 0) {
    buffStrength = player.getMeta(skillStat);
  }
  for (const [name, attribute] of minion.attributes) {
    let minionAttr = minion.getAttribute(name);
    minionAttr = Math.floor(minionAttr * (1 + (player.level / 100)) * (1 + (buffStrength / 100)));
    minion.attributes.get(name).setBase(minionAttr);
  }
  minion.min_damage = Math.floor(minion.min_damage * (1 + (player.level / 100)) * (1 + (buffStrength / 100)));
  minion.max_damage = Math.floor(minion.max_damage * (1 + (player.level / 100)) * (1 + (buffStrength / 100)));
  return minion;
};

/**
 * Skill up probability
 */
exports.skillUp = function (state, player, skillStat) {
  const skillUpChance = 5;

  if (!player.isNpc) {
    const rnd = Math.floor((Math.random() * 100) + 1);
    if (rnd < skillUpChance) {
      if (player.getMeta(skillStat) < 100) {
        const ability = player.getMeta(skillStat);
        const [prefix, skillId1, skillId2] = skillStat.split('_');

        let skill = null;
        let skillId = skillId1;
        if (skillId2) {
          skillId = `${skillId1}_${skillId2}`;
        }

        if (prefix === 'skill') {
          skill = state.SkillManager.find(skillId);
          Broadcast.sayAt(player, `<bold><cyan>Вы почувствовали себя увереннее в умении '${skill.name[0].toUpperCase()}${skill.name.slice(1)}'.</cyan></bold>`);
        } else {
          skill = state.SpellManager.find(skillId);
          Broadcast.sayAt(player, `<bold><cyan>Вы почувствовали себя увереннее в заклинании '${skill.name[0].toUpperCase()}${skill.name.slice(1)}'.</cyan></bold>`);
        }
        return player.setMeta(skillStat, ability + 1);
      }
    }
  }
};
