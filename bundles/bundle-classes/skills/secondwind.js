'use strict';

const { SkillFlag, SkillType } = require('ranvier');

const interval = 2 * 60;
const threshold = 30;
const restorePercent = 50;

/**
 * Basic warrior passive
 */
module.exports = {
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
