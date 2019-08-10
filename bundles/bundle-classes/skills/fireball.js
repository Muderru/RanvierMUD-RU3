'use strict';

const { Broadcast, Damage, SkillType } = require('ranvier');

const damagePercent = 100;
const manaCost = 80;

function getDamage(player) {
  return player.getAttribute('intellect') * (damagePercent / 100);
}

/**
 * Basic mage spell
 */
module.exports = {
  aliases: ['огненный шар'],
  name: 'Огненный шар',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 10,

  run: state => function (args, player, target) {
    const damage = new Damage('health', getDamage(player), player, this, {
      type: 'physical',
    });

    Broadcast.sayAt(player, '<bold>Волна из ваших рук породила <red>огненный</red></bold><yellow> ш<bold>ар</bold></yellow> <bold>, устремившийся к вашей цели!</bold>');
    Broadcast.sayAtExcept(player.room, `<bold>Волна из рук ${player.rname} породила <red>огненный</red></bold><yellow> ш<bold>ар</bold></yellow> <bold>, устремившийся к ${target.dname}!</bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold>Волна из рук ${player.rname} породила <red>огненный</red></bold><yellow> ш<bold>ар</bold></yellow> <bold>, устремившийся к Вам!</bold>`);
    }
    damage.commit(target);
  },

  info: (player) => {
    return `Создает огненный шар, наносящий урон в размере${damagePercent}% от вашего интеллекта.`;
  }
};
