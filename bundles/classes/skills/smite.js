'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');
const Combat = require('../../combat/lib/Combat');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 10;
const manaCost = 50;
const ddMod = 1.5; //direct damage coefficient

module.exports = {
  aliases: ['сокрушить', 'сокрушение'],
  name: 'сокрушение',
  gender: 'neuter',
  damageVerb: 'травмирует',
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

    let amount = Math.floor(SkillUtil.directSkillDamage(player, target, 'crushing', 'smite') * ddMod);

    const damage = new Damage('health', amount, player, this);

    Broadcast.sayAt(player, `<b><yellow>Вы наполнили ваше оружие святой энергией и сокрушили им ${target.vname}!</yellow></b>`);
    if (player.gender === 'male') {
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.Name} наполнил свое оружие святой энергией и сокрушил им ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.Name} наполнил свое оружие святой энергией и сокрушил им вас!</yellow></b>`);
    } else if (player.gender === 'female') {
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.Name} наполнила свое оружие святой энергией и сокрушила им ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.Name} наполнила свое оружие святой энергией и сокрушила им вас!</yellow></b>`);
    } else if (player.gender === 'plural') {
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.Name} наполнили свои оружия святой энергией и сокрушили им ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.Name} наполнили свои оружия святой энергией и сокрушили им вас!</yellow></b>`);
    } else {
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.Name} наполнило свое оружие святой энергией и сокрушило им ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.Name} наполнило свое оружие святой энергией и сокрушило им вас!</yellow></b>`);
    }

    damage.commit(target);

    SkillUtil.skillUp(state, player, 'skill_smite');
  },

  info: (player) => {
    return `Усильте ваше оружие святой энергией и бейте врага, нанося урон зависящий от урона вашего оружия, силы, вашего бонусного дробящего урона, уровня владения умением и сопротивляемости дробящему урону цели. Требует оружие.`;
  }
};
