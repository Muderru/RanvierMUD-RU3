'use strict';

const Combat = require('../../ranvier-combat/lib/Combat');

/**
 * Basic warrior attack
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Damage = require(srcPath + 'Damage');
  const SkillType = require(srcPath + 'SkillType');

  const damagePercent = 250;
  const energyCost = 20;

  function getDamage(player) {
    return Combat.calculateWeaponDamage(player) * (damagePercent / 100);
  }

  return {
    name: 'Выпад',
    type: SkillType.SKILL,
    requiresTarget: true,
    initiatesCombat: true,
    resource: {
      attribute: 'energy',
      cost: energyCost,
    },
    cooldown: 6,

    run: state => function (args, player, target) {
      const damage = new Damage({
        attribute: 'health',
        amount: getDamage(player),
        attacker: player,
        type: 'physical',
        source: this
      });

      Broadcast.sayAt(player, '<red>Вы упираетесь в землю и наносите мощный удар!</red>');
      Broadcast.sayAtExcept(player.room, `<red>${player.name} упирается в землю и наносит мощный удар ${target.dname}!</red>`, [player, target]);
      if (!target.isNpc) {
        Broadcast.sayAt(target, `<red>${player.name} упирается в землю и наносит вам мощный удар!</red>`);
      }
      damage.commit(target);
    },

    info: (player) => {
      return `Выполняет мощную атаку против вашего противника и наносит ему <bold>${damagePercent}%</bold> оружейного урона.`;
    }
  };
};
