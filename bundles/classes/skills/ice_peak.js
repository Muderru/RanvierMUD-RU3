'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

const manaCost = 80;

function getAttr1(player, target) {
  let addDamage = 0;
  if (player.hasAttribute('cold_damage')) {
    if (target.hasAttribute('cold_resistance')) {
      if (player.getAttribute('cold_damage') > target.getAttribute('cold_resistance')) {
        addDamage += player.getAttribute('cold_damage') - target.getAttribute('cold_resistance');
      }
    } else {
        addDamage += player.getAttribute('cold_damage');
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
  if (player.getMeta('spell_ice_peak') > 0) {
    addDamage = player.getMeta('spell_ice_peak')*0.01;
  }
  return 1+addDamage;
}

/**
 * Basic mage spell
 */
module.exports = {
  aliases: ['ледяной снаряд'],
  name: 'ледяной снаряд',
  gender: 'male',
  damageVerb: 'заморозил',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 15,

  run: state => function (args, player, target) {
    let getDamage = Math.floor(0.8*Combat.calculateWeaponDamage(player)*getAttr1(player, target)*getAttr2(player)*getSkill(player));

    if (player.isNpc) {
      getDamage *= 2;
    }

    const damage = new Damage('health', getDamage, player, this, {
      type: 'physical',
    });

    let duration = 0;
    if (player.hasAttribute('agility')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('agility')/10));
    }

    const effect = state.EffectFactory.create('ice_peak', {duration}, {spellStrength: Math.floor(1 + getDamage/100)});
    target.addEffect(effect);


    Broadcast.sayAt(player, `<bold><blue>Воздух между ваших рук замерз, принимая форму сосульки, которая поражает ${target.vname}!</blue></bold>`);
    Broadcast.sayAtExcept(player.room, `<bold><blue>Воздух между рук ${player.rname} замерз, принимая форму сосульки, которая поражает ${target.vname}!</blue></bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold><blue>Воздух между рук ${player.rname} замерз, принимая форму сосульки, которая поражает ВАС!</blue></bold>`);
    }
    damage.commit(target);
    
    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('spell_ice_peak') < 100) {
            let skillUp = player.getMeta('spell_ice_peak');
            player.setMeta('spell_ice_peak', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Ледяной снаряд\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Создает ледяную сосульку, наносящую урон зависящий от урона вашего оружия, интеллекта, вашего бонусного урона холодом, уровня владения умением и сопротивляемости холоду цели. Может заморозить противника.`;
  }
};
