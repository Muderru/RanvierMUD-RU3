'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');
const Combat = require('../../bundle-combat/lib/Combat');

const manaCost = 40;

function getAttr1(player, target) {
  let addDamage = 0;
  if (player.hasAttribute('piercing_damage')) {
    if (target.hasAttribute('piercing_resistance')) {
      if (player.getAttribute('piercing_damage') > target.getAttribute('piercing_resistance')) {
        addDamage += player.getAttribute('piercing_damage') - target.getAttribute('piercing_resistance');
      }
    } else {
        addDamage += player.getAttribute('piercing_damage');
    }
  }
  addDamage = 1+addDamage*0.05;
  return addDamage;
}

function getAttr2(player) {
  let addDamage = 0;
  if (player.hasAttribute('strength')) {
      addDamage += player.getAttribute('strength');
  } else {
      addDamage = 20;
  }

  addDamage = 1+addDamage*0.01;
  return addDamage;
}

function getSkill(player) {
  let addDamage = 0;
  if (player.getMeta('skill_lunge') > 0) {
    addDamage = player.getMeta('skill_lunge')*0.01;
  }
  return 1+addDamage;
}

/**
 * Basic warrior attack
 */
module.exports = {
  aliases: ['выпад'],
  name: 'Выпад',
  gender: 'male',
  damageVerb: 'ранит',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 5,

  run: state => function (args, player, target) {
    if (!player.isNpc) {
      if (!player.equipment.has('оружие')) {
        return Broadcast.sayAt(player, "Вы не вооружены.");
      }
    }

    const getDamage = Math.floor(Combat.calculateWeaponDamage(player)*getAttr1(player, target)*getAttr2(player)*getSkill(player));
    const damage = new Damage('health', getDamage, player, this, {
      type: 'physical',
    });

      Broadcast.sayAt(player, '<red>Вы делаете обманный маневр и наносите мощный удар ${target.dname}!</red>');
      Broadcast.sayAtExcept(player.room, `<red>${player.name} делает обманный маневр и наносит мощный удар ${target.dname}!</red>`, [player, target]);
      if (!target.isNpc) {
        Broadcast.sayAt(target, `<red>${player.name} делает обманный маневр и наносит вам мощный удар!</red>`);
    }
    damage.commit(target);
    
    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_lunge') < 100) {
            let skillUp = player.getMeta('skill_lunge');
            player.setMeta('skill_lunge', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в умении \'Выпад\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
      return `Выполняет мощную атаку против вашего противника и наносит ему урон зависящий от урона вашего оружия, силы, вашего бонусного пронзающего урона, уровня владения умением и сопротивляемости пронзающему урону цели.`;
  }
};
