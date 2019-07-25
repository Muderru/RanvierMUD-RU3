'use strict';

/**
 * Basic cleric spell
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Heal = require(srcPath + 'Heal');
  const SkillType = require(srcPath + 'SkillType');

  const healPercent = 300;
  const energyCost = 40;

  function getHeal(player) {
    return player.getAttribute('intellect') * (healPercent / 100);
  }

  return {
    name: 'Лечение',
    type: SkillType.SPELL,
    requiresTarget: true,
    initiatesCombat: false,
    targetSelf: true,
    resource: {
      attribute: 'energy',
      cost: energyCost,
    },
    cooldown: 10,

    run: state => function (args, player, target) {
      const heal = new Heal({
        attribute: 'health',
        amount: getHeal(player),
        attacker: player,
        source: this
      });

      if (target !== player) {
        Broadcast.sayAt(player, `<b>Вы призываете силы Света и лечите раны ${target.rname}.</b>`);
        Broadcast.sayAtExcept(player.room, `<b>${player.name} призывает силы Света и лечит раны ${target.rname}.</b>`, [target, player]);
        Broadcast.sayAt(target, `<b>${player.name} призывает силы Света и лечит ваши раны.</b>`);
      } else {
        Broadcast.sayAt(player, "<b>Вы призываете силы Света и лечите ваши раны.</b>");
        Broadcast.sayAtExcept(player.room, `<b>${player.name} призывает силы Света и лечит свои раны.</b>`, [player, target]);
      }

      heal.commit(target);
    },

    info: (player) => {
      return `Призвать силы Света и лечить раны на ${healPercent}% от вашего интеллекта.`;
    }
  };
};
