const { Broadcast, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 30;
const cost = 120;
const maxChance = 95;

function getAttr(player) {
  let addDamage = 0;
  if (player.hasAttribute('agility')) {
    addDamage += player.getAttribute('agility');
  } else {
    addDamage = 20;
  }

  addDamage /= 2;
  return addDamage;
}

function getSkill(player) {
  let addDamage = 1;
  if (player.getMeta('skill_rescue') > 0) {
    addDamage += player.getMeta('skill_rescue');
  }
  return addDamage / 2;
}

/**
 * Спасти, для мобов пока не работает
 */
module.exports = {
  aliases: ['спасти'],
  name: 'спасти',
  gender: 'male',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: false,
  resource: {
    attribute: 'mana',
    cost,
  },
  cooldown,

  run: (state) => function (args, player, target) {
    if (!target.isInCombat()) {
      return Broadcast.sayAt(player, `${target.name} не нуждается в спасении.`);
    }

    let chance = 0;
    chance = 20 + getAttr(player) + getSkill(player);
    if (chance > maxChance) {
      chance = maxChance;
    }
    if (player.isNpc) {
      chance = maxChance;
    }

    const random = Math.floor(Math.random() * 100 + 1);
    if (random < chance) {
      const enemy = [...target.combatants][0];
      target.removeFromCombat();
      player.initiateCombat(enemy);
      Broadcast.sayAt(player, `Вы спасаете <bold>${target.vname}</bold>!</red>`);
      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.Name} спасает <bold>${target.vname}.</bold>`, [target, player]);
        Broadcast.sayAt(target, `${player.Name} спасает <bold>ВАС.</bold>`);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.Name} спасает <bold>${target.vname}.</bold>`, [target, player]);
        Broadcast.sayAt(target, `${player.Name} спасает <bold>ВАС.</bold>`);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.Name} спасают <bold>${target.vname}.</bold>`, [target, player]);
        Broadcast.sayAt(target, `${player.Name} спасают <bold>ВАС.</bold>`);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.Name} спасает <bold>${target.vname}.</bold>`, [target, player]);
        Broadcast.sayAt(target, `${player.Name} спасает <bold>ВАС.</bold>`);
      }
    } else {
      Broadcast.sayAt(player, `Вам не удается спасти <bold>${target.vname}</bold>!</red>`);
      Broadcast.sayAtExcept(player.room, `${player.Name} не удается спасти <bold>${target.vname}</bold>`, [target, player]);
      Broadcast.sayAt(target, `${player.Dname} не удается спасти <bold>ВАС.</bold>`);
    }

    SkillUtil.skillUp(state, player, 'skill_rescue');
  },

  info: (player) => 'Позволяет вам спасти цель от битвы, привлекая внимание врагов на себя.',
};
