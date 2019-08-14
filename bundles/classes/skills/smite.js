'use strict';

const { Broadcast, Damage } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

const cooldown = 10;
const manaCost = 20;

function getAttr1(player, target) {
  let addDamage = 0;
  if (player.hasAttribute('crushing_damage')) {
    if (target.hasAttribute('crushing_resistance')) {
      if (player.getAttribute('crushing_damage') > target.getAttribute('crushing_resistance')) {
        addDamage += player.getAttribute('crushing_damage') - target.getAttribute('crushing_resistance');
      }
    } else {
        addDamage += player.getAttribute('crushing_damage');
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
  if (player.getMeta('skill_smite') > 0) {
    addDamage = player.getMeta('skill_smite')*0.01;
  }
  return 1+addDamage;
}

module.exports = {
  aliases: ['сокрушить', 'сокрушение'],
  name: 'Сокрушение',
  gender: 'neither',
  damageVerb: 'травмирует',
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown,

  run: state => function (args, player, target) {
    if (!player.isNpc) {
      if (!player.equipment.has('оружие')) {
        return Broadcast.sayAt(player, "Вы не вооружены.");
      }
    }

    const amount = Math.floor(Combat.calculateWeaponDamage(player)*getAttr1(player, target)*getAttr2(player)*getSkill(player));

    const damage = new Damage('health', amount, player, this, {
      type: 'holy',
    });

    Broadcast.sayAt(player, `<b><yellow>Вы наполнили ваше оружие святой энергией и сокрушили им ${target.vname}!</yellow></b>`);
    if (player.gender === 'male') {
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} наполнил свое оружие святой энергией и сокрушил им ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.name} наполнил свое оружие святой энергией и сокрушил им вас!</yellow></b>`);
    } else if (player.gender === 'female') {
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} наполнила свое оружие святой энергией и сокрушила им ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.name} наполнила свое оружие святой энергией и сокрушила им вас!</yellow></b>`);
    } else if (player.gender === 'plural') {
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} наполнили свои оружия святой энергией и сокрушили им ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.name} наполнили свои оружия святой энергией и сокрушили им вас!</yellow></b>`);
    } else {
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} наполнило свое оружие святой энергией и сокрушило им ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.name} наполнило свое оружие святой энергией и сокрушило им вас!</yellow></b>`);
    }

    damage.commit(target);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_smite') < 100) {
            let skillUp = player.getMeta('skill_smite');
            player.setMeta('skill_smite', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в умении \'Сокрушение\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Усильте ваше оружие святой энергией и бейте врага, нанося урон зависящий от урона вашего оружия, силы, вашего бонусного дробящего урона, уровня владения умением и сопротивляемости дробящему урону цели. Требует оружие.`;
  }
};
