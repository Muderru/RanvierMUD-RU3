'use strict';

const { Broadcast, SkillType, Damage } = require('ranvier');

// config placed here just for easy copy/paste of this skill later on
const cooldown = 30;
const cost = 120;

function getAttr(player) {
  let addDamage = 0;
  if (player.hasAttribute('agility')) {
      addDamage += player.getAttribute('agility');
  } else {
      addDamage = 20;
  }

  addDamage = addDamage/2;
  return addDamage;
}

function getSkill(player) {
  let addDamage = 1;
  if (player.getMeta('skill_rescue') > 0) {
    addDamage += player.getMeta('skill_rescue');
  }
  return addDamage/2;
}

/**
 * Спасти
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

  run: state => function (args, player, target) {
    if (!target.isInCombat()) {
      return Broadcast.sayAt(player, `${target.name} не нуждается в спасении.`);
    }

    let chance = 0;
    chance = 20 + getAttr(player) + getSkill(player);
    if (chance > 95) {
      chance = 95;
    }
    if (player.isNpc) {
      chance = 95;
    }

    let random = Math.floor(Math.random()*101);
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

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_rescue') < 100) {
            let skillUp = player.getMeta('skill_rescue');
            player.setMeta('skill_rescue', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в умении \'Спасти\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Позволяет вам спасти цель от битвы, привлекая внимание врагов на себя.`;
  }
};
