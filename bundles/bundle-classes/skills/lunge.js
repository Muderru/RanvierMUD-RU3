'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');
const Combat = require('../../bundle-combat/lib/Combat');

const damagePercent = 250;
const manaCost = 20;

function getDamage(player) {
  return Combat.calculateWeaponDamage(player) * (damagePercent / 100);
}

/**
 * Basic warrior attack
 */
module.exports = {
  aliases: ['выпад'],
  name: 'Выпад',
  gender: 'male',
  damageVerb: 'ранит',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 6,

  run: state => function (args, player, target) {
    const damage = new Damage('health', getDamage(player), player, this, {
      type: 'physical',
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
