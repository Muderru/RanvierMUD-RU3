'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

const manaCost = 40;

function getAttr1(player, target) {
  let addDamage = 0;
  if (player.hasAttribute('fire_damage')) {
    if (target.hasAttribute('fire_resistance')) {
      if (player.getAttribute('fire_damage') > target.getAttribute('fire_resistance')) {
        addDamage += player.getAttribute('fire_damage') - target.getAttribute('fire_resistance');
      }
    } else {
        addDamage += player.getAttribute('fire_damage');
    }
  }
  addDamage = 1+addDamage*0.05;
  return addDamage;
}

function getAttr2(player) {
  let addDamage = 0;
  if (player.hasAttribute('intellect')) {
      addDamage += player.getAttribute('intellect');
  } else {
      addDamage = 20;
  }

  addDamage = 1+addDamage*0.01;
  return addDamage;
}

function getSkill(player) {
  let addDamage = 0;
  if (player.getMeta('skill_fireball') > 0) {
    addDamage = player.getMeta('skill_fireball')*0.01;
  }
  return 1+addDamage;
}

/**
 * Basic mage spell
 */
module.exports = {
  aliases: ['огненный шар'],
  name: 'огненный шар',
  gender: 'male',
  damageVerb: 'опалил',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 5,

  run: state => function (args, player, target) {
    const getDamage = Math.floor(Combat.calculateWeaponDamage(player)*getAttr1(player, target)*getAttr2(player)*getSkill(player));
    const damage = new Damage('health', getDamage, player, this, {
      type: 'physical',
    });

    Broadcast.sayAt(player, '<bold>Волна из ваших рук породила <red>огненный</red></bold><yellow> ш<bold>ар</bold></yellow> <bold>, устремившийся к вашей цели!</bold>');
    Broadcast.sayAtExcept(player.room, `<bold>Волна из рук ${player.rname} породила <red>огненный</red></bold><yellow> ш<bold>ар</bold></yellow> <bold>, устремившийся к ${target.dname}!</bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold>Волна из рук ${player.rname} породила <red>огненный</red></bold><yellow> ш<bold>ар</bold></yellow> <bold>, устремившийся к Вам!</bold>`);
    }
    damage.commit(target);
    
    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_fireball') < 100) {
            let skillUp = player.getMeta('skill_fireball');
            player.setMeta('skill_fireball', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Огненный шар\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Создает огненный шар, наносящий урон зависящий от урона вашего оружия, интеллекта, вашего бонусного урона огнем, уровня владения умением и сопротивляемости огню цели.`;
  }
};
