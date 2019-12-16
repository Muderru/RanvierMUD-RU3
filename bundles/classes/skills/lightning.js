'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

const manaCost = 60;

function getAttr1(player, target) {
  let addDamage = 0;
  if (player.hasAttribute('lightning_damage')) {
    if (target.hasAttribute('lightning_resistance')) {
      if (player.getAttribute('lightning_damage') > target.getAttribute('lightning_resistance')) {
        addDamage += player.getAttribute('lightning_damage') - target.getAttribute('lightning_resistance');
      }
    } else {
        addDamage += player.getAttribute('lightning_damage');
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
  if (player.getMeta('spell_lightning') > 0) {
    addDamage = player.getMeta('spell_lightning')*0.01;
  }
  return 1+addDamage;
}

/**
 * Basic mage spell
 */
module.exports = {
  aliases: ['молния'],
  name: 'молния',
  gender: 'female',
  damageVerb: 'поразила',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 5,

  run: state => function (args, player, target) {
    let getDamage = Math.floor(Combat.calculateWeaponDamage(player)*getAttr1(player, target)*getAttr2(player)*getSkill(player));
    let damageHealth = 0.9*getDamage;
    let damageMana = 0.1*getDamage;

    if (player.isNpc) {
      getDamage *= 2;
    }

    const damage1 = new Damage('health', damageHealth, player, this, {
      type: 'physical',
    });

    Broadcast.sayAt(player, `<bold><yellow>Ваши руки заискрились и выпустили мощную молнию в ${target.vname}!</yellow></bold>`);
    Broadcast.sayAtExcept(player.room, `<bold><yellow>Руки ${player.rname} заискрились и выпустили мощную молнию в ${target.vname}!</yellow></bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold><yellow>Руки ${player.rname} заискрились и выпустили мощную молнию в ВАС!</yellow></bold>`);
    }

    damage1.commit(target);
    if (target.hasAttribute('mana')) {
      const damage2 = new Damage('mana', damageMana, player, this, {
        type: 'physical',
      });
      damage2.commit(target);
    }

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('spell_lightning') < 100) {
            let skillUp = player.getMeta('spell_lightning');
            player.setMeta('spell_lightning', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Молния\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Создает мощную молнию, наносящий урон зависящий от урона вашего оружия, интеллекта, вашего бонусного урона молнией, уровня владения умением и сопротивляемости молнии цели. Сжигает часть маны противника.`;
  }
};
