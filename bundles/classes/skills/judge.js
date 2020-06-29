'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');
const Combat = require('../../combat/lib/Combat');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 20;
const manaCost = 60;
const reductionPercent = 50; //debaff %
const ddMod = 0.9; //direct damage coefficient

module.exports = {
  aliases: ['осуждение'],
  name: 'осуждение',
  gender: 'neuter',
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

    let amount = Math.floor(SkillUtil.directSkillDamage(player, target, 'crushing', 'judge') * ddMod);

    const damage = new Damage('health', amount, player, this);

    Broadcast.sayAt(player, `<b><yellow>Поток священной силы сотрясает ${target.vname}!</yellow></b>`);
    Broadcast.sayAtExcept(player.room, `<b><yellow>${player.Name} сотрясает потоком священной энергии ${target.vname}!</yellow></b>`, [target, player]);
    Broadcast.sayAt(target, `<b><yellow>${player.Name} сотрясает вас потоком священной энергии!</yellow></b>`);

    damage.commit(target);
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'skill_judge');
  },

  info: (player) => {
    return `Поражает цель священной энергией и наносит урон зависящий от урона вашего оружия, силы, вашего бонусного дробящего урона, уровня владения умением и сопротивляемости дробящему урону цели. Также уменьшает урон от следующей атаки цели на <b>${reductionPercent}%</b>.`;
  }
};
