'use strict';

const { Broadcast, SkillType, Damage } = require('ranvier');
const Combat = require('../../bundle-combat/lib/Combat');

// config placed here just for easy copy/paste of this skill later on
const cooldown = 10;
const cost = 60;
const tickInterval = 1;

function getAttr1(player, target) {
  let addDamage = 0;
  if (player.hasAttribute('cutting_damage')) {
    if (target.hasAttribute('cutting_resistance')) {
      if (player.getAttribute('cutting_damage') > target.getAttribute('cutting_resistance')) {
        addDamage += player.getAttribute('cutting_damage') - target.getAttribute('cutting_resistance');
      }
    } else {
        addDamage += player.getAttribute('cutting_damage');
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
  if (player.getMeta('skill_rend') > 0) {
    addDamage = player.getMeta('skill_rend')*0.01;
  }
  return 1+addDamage;
}

function totalDamage(player, target) {
  let addDamage = 1;
  if (player.hasAttribute('cutting_damage')) {
    if (target.hasAttribute('cutting_resistance')) {
      if (player.getAttribute('cutting_damage') > target.getAttribute('cutting_resistance')) {
        addDamage = player.getAttribute('cutting_damage') - target.getAttribute('cutting_resistance');
      }
    } else {
        addDamage = player.getAttribute('cutting_damage');
    }
  }
  return addDamage;
};


/**
 * DoT (Damage over time) skill
 */
module.exports = {
  aliases: ['порез', 'разрезать'],
  name: 'Порез',
  gender: 'male',
  damageVerb: 'ранит',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost,
  },
  cooldown,

  run: state => function (args, player, target) {
    if (!player.isNpc) {
      if (!player.equipment.has('оружие')) {
        return Broadcast.sayAt(player, "Вы не вооружены.");
      }
    }

    const getDamage = Math.floor(0.9*Combat.calculateWeaponDamage(player)*getAttr1(player, target)*getAttr2(player)*getSkill(player));
    const damage = new Damage('health', getDamage, player, this, {
      type: 'physical',
    });

    let duration = 1;
    if (player.hasAttribute('agility')) {
        duration += Math.floor(player.getAttribute('agility')/10);
    } else {
        duration += 2;
    }

    const effect = state.EffectFactory.create(
      'skill.rend',
      {
        duration,
        description: this.info(player),
        tickInterval,
      },
      {
        totalDamage: totalDamage(player, target),
      }
    );
    effect.skill = this;
    effect.attacker = player;

    effect.on('effectDeactivated', _ => {
      if (target.gender === 'male') {
         Broadcast.sayAt(player, `<red><b>${target.name}</b> перестал кровоточить.</red>`);
      } else if (target.gender === 'female') {
         Broadcast.sayAt(player, `<red><b>${target.name}</b> перестала кровоточить.</red>`);
      } else if (target.gender === 'plural') {
         Broadcast.sayAt(player, `<red><b>${target.name}</b> перестали кровоточить.</red>`);
      } else {
         Broadcast.sayAt(player, `<red><b>${target.name}</b> перестало кровоточить.</red>`);
      }
    });

    Broadcast.sayAt(player, `<red>Подлой атакой вы нанесли рваную рану <bold>${target.dname}</bold>!</red>`);
    if (player.gender === 'male') {
      Broadcast.sayAtExcept(player.room, `<red>${player.name} подлой атакой нанес рваную рану ${target.dname}.</red>`, [target, player]);
      Broadcast.sayAt(target, `<red>${player.name} подлой атакой нанес вам рваную рану!</red>`);
    } else if (player.gender === 'female') {
      Broadcast.sayAtExcept(player.room, `<red>${player.name} подлой атакой нанесла рваную рану ${target.dname}.</red>`, [target, player]);
      Broadcast.sayAt(target, `<red>${player.name} подлой атакой нанесла вам рваную рану!</red>`);
    } else if (player.gender === 'plural') {
      Broadcast.sayAtExcept(player.room, `<red>${player.name} подлой атакой нанесли рваную рану ${target.dname}.</red>`, [target, player]);
      Broadcast.sayAt(target, `<red>${player.name} подлой атакой нанесли вам рваную рану!</red>`);
    } else {
      Broadcast.sayAtExcept(player.room, `<red>${player.name} подлой атакой нанесло рваную рану ${target.dname}.</red>`, [target, player]);
      Broadcast.sayAt(target, `<red>${player.name} подлой атакой нанесло вам рваную рану!</red>`);
    }      
    damage.commit(target);
    target.addEffect(effect);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_rend') < 100) {
            let skillUp = player.getMeta('skill_rend');
            player.setMeta('skill_rend', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в умении \'Порез\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Наносит цели рваную рану, наносящую урон зависящий от урона вашего оружия, силы, вашего бонусного режущего урона, уровня владения умением и сопротивляемости режущему урону цели. Длительность кровотечения зависит от ловкости атакующего.`;
  }
};
