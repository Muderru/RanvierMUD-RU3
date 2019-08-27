'use strict';

const { Broadcast, Damage, Heal, SkillType } = require('ranvier');
const Combat = require('../../combat/lib/Combat');

// config placed here just for easy copy/paste of this skill later on
const cooldown = 8;
const manaCost = 60;
const reductionPercent = 10;

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
  if (player.getMeta('skill_judge') > 0) {
    addDamage = player.getMeta('skill_judge')*0.01;
  }
  return 1+addDamage;
}

module.exports = {
  aliases: ['осуждение'],
  name: 'осуждение',
  gender: 'neither',
  damageVerb: 'мучает',
  type: SkillType.SKILL,
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

    const effect = state.EffectFactory.create('skill.judge', {}, { reductionPercent });
    effect.skill = this;
    effect.attacker = player;

    let amount = Math.floor(Combat.calculateWeaponDamage(player)*getAttr1(player, target)*getAttr2(player)*getSkill(player));
    
    if (player.isNpc) {
      amount *= 2;
    }
    
    const damage = new Damage('health', amount, player, this, {
      type: 'holy',
    });

      Broadcast.sayAt(player, `<b><yellow>Поток священной силы сотрясает ${target.vname}!</yellow></b>`);
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.Name} сотрясает потоком священной энергии ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.Name} сотрясает вас потоком священной энергии!</yellow></b>`);

    damage.commit(target);
    target.addEffect(effect);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_judge') < 100) {
            let skillUp = player.getMeta('skill_judge');
            player.setMeta('skill_judge', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в умении \'Осуждение\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
      return `Поражает цель священной энергией и наносит урон зависящий от урона вашего оружия, силы, вашего бонусного дробящего урона, уровня владения умением и сопротивляемости дробящему урону цели. Также уменьшает урон от следующей атаки цели на <b>${reductionPercent}%</b>.`;
  }
};
