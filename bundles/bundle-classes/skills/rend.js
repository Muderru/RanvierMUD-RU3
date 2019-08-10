'use strict';

const { Broadcast, SkillType } = require('ranvier');
const Combat = require('../../bundle-combat/lib/Combat');

// config placed here just for easy copy/paste of this skill later on
const cooldown = 10;
const cost = 50;
const duration = 20 * 1000;
const tickInterval = 3;
const damagePercent = 400;

const totalDamage = player => {
  return Combat.calculateWeaponDamage(player) * (damagePercent / 100);
};


/**
 * DoT (Damage over time) skill
 */
module.exports = {
  aliases: ['рваная рана', 'разорвать'],
  name: 'Рваная рана',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost,
  },
  cooldown,

  run: state => function (args, player, target) {
    const effect = state.EffectFactory.create(
      'skill.rend',
      {
        duration,
        description: this.info(player),
        tickInterval,
      },
      {
        totalDamage: totalDamage(player),
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
    target.addEffect(effect);
  },

  info: (player) => {
    return `Наносит цели рваную рану, наносящую <bold>${damagePercent}%</bold> оружейного урона в течении <bold>${duration / 1000}</bold> сек.`;
  }
};
