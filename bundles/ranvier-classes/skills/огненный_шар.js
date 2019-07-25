'use strict';

/**
 * Basic mage spell
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Damage = require(srcPath + 'Damage');
  const SkillType = require(srcPath + 'SkillType');

  const damagePercent = 100;
  const manaCost = 20;

  function getDamage(player) {
    return player.getAttribute('intellect') * (damagePercent / 100);
  }

  return {
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
      const damage = new Damage({
        attribute: 'health',
        amount: getDamage(player),
        attacker: player,
        type: 'physical',
        source: this
      });

      Broadcast.sayAt(player, '<bold>Вы запустили огромный <red>огненный шар</red> в ${target.vname}!</bold>');
      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `<bold>${player.name} запустил огромный <red>огненный шар</red> в ${target.vname}!</bold>`, [player, target]);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `<bold>${player.name} запустила огромный <red>огненный шар</red> в ${target.vname}!</bold>`, [player, target]);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `<bold>${player.name} запустили огромный <red>огненный шар</red> в ${target.vname}!</bold>`, [player, target]);
      } else {
        Broadcast.sayAtExcept(player.room, `<bold>${player.name} запустило огромный <red>огненный шар</red> в ${target.vname}!</bold>`, [player, target]);
      }

      if (!target.isNpc) {
          if (player.gender === 'male') {
            Broadcast.sayAt(target, `<bold>${player.name} запустил в вас огромный <red>огненный шар</red>!</bold>`);
          } else if (player.gender === 'female') {
            Broadcast.sayAt(target, `<bold>${player.name} запустила в вас огромный <red>огненный шар</red>!</bold>`);
          } else if (player.gender === 'plural') {
            Broadcast.sayAt(target, `<bold>${player.name} запустили в вас огромный <red>огненный шар</red>!</bold>`);
          } else {
            Broadcast.sayAt(target, `<bold>${player.name} запустило в вас огромный <red>огненный шар</red>!</bold>`);
          }
      }
      
      damage.commit(target);
    },

    info: (player) => {
      return `Запускает в цель магический огненный шар и наносит ${damagePercent}% от вашего интеллекта огненного урона.`;
    }
  };
};
