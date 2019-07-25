'use strict';

/**
 * Basic warrior passive
 */
module.exports = (srcPath) => {

  const SkillType = require(srcPath + 'SkillType');
  const SkillFlag = require(srcPath + 'SkillFlag');

  const interval = 2 * 60;
  const threshold = 30;
  const restorePercent = 50;

  return {
    name: 'Второе дыхание',
    type: SkillType.SKILL,
    flags: [SkillFlag.PASSIVE],
    effect: "skill.secondwind",
    cooldown: interval,

    configureEffect: effect => {
      effect.state = Object.assign(effect.state, {
        threshold: threshold,
        restorePercent: restorePercent,
      });

      return effect;
    },

    info: function (player) {
      return `Каждые ${interval / 60} минут, когда энергия падает ниже ${threshold}, восстанавливает ${restorePercent}% от вашей максимальной энергии.`;
    }
  };
};
