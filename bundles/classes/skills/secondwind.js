'use strict';

const { SkillFlag, SkillType } = require('ranvier');

const interval = 5 * 60;
const threshold = 30;

function restorePercent(player) {
  let addDamage = 1;
  if (player.getMeta('skill_secondwind') > 0) {
    addDamage = player.getMeta('skill_secondwind')*0.5;
  }
  return Math.ceil(addDamage);
}

/**
 * Basic warrior passive
 */
module.exports = {
  aliases: ['второе дыхание'],
  name: 'второе дыхание',
  gender: 'neither',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],
  effect: "skill.secondwind",
  cooldown: interval,

  configureEffect: effect => {
    effect.state = Object.assign(effect.state, {
      threshold: threshold,
      restorePercent: restorePercent(player),
    });

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_secondwind') < 100) {
            let skillUp = player.getMeta('skill_secondwind');
            player.setMeta('skill_secondwind', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в умении \'Второе дыхание\'.</cyan></bold>');
          }
      }
    }

    return effect;
  },

  info: function (player) {
    return `Каждые ${interval / 60} минут, когда энергия падает ниже ${threshold}%, восстанавливается часть от вашей максимальной энергии.`;
  }
};
