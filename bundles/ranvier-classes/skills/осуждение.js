'use strict';

const Combat = require('../../ranvier-combat/lib/Combat');

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const SkillType = require(srcPath + 'SkillType');
  const Damage = require(srcPath + 'Damage');
  const Heal = require(srcPath + 'Heal');

  // config placed here just for easy copy/paste of this skill later on
  const cooldown = 4;
  const damagePercent = 150;
  const favorAmount = 3;
  const reductionPercent = 30;

  return {
    name: 'Осуждение',
    type: SkillType.SKILL,
    requiresTarget: true,
    initiatesCombat: true,
    cooldown,

    run: state => function (args, player, target) {
      const effect = state.EffectFactory.create('skill.judge', target, {}, { reductionPercent });
      effect.skill = this;
      effect.attacker = player;

      const damage = new Damage({
        attribute: 'health',
        amount: Combat.calculateWeaponDamage(player) * (damagePercent / 100),
        attacker: player,
        type: 'holy',
        source: this
      });

      const favorRestore = new Heal({
        attribute: 'favor',
        amount: favorAmount,
        source: this
      });

      Broadcast.sayAt(player, `<b><yellow>Поток священной силы сотрясает ${target.vname}!</yellow></b>`);
      Broadcast.sayAtExcept(player.room, `<b><yellow>${player.name} сотрясает потоком священной энергии ${target.vname}!</yellow></b>`, [target, player]);
      Broadcast.sayAt(target, `<b><yellow>${player.name} сотрясает вас потоком священной энергии!</yellow></b>`);

      damage.commit(target);
      target.addEffect(effect);
      favorRestore.commit(player);
    },

    info: (player) => {
      return `Поражает цель священной энергией и наносит <b>${damagePercent}%</b> оружейного урона, уменьшает следующую атаку цели на <b>${reductionPercent}%</b>. Создает <b><yellow>${favorAmount}</yellow></b> воли.`;
    }
  };
};
