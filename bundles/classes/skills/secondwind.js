const { SkillFlag, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const interval = 5 * 60;
const threshold = 30;
const buffMod = 2; // сила баффа

/**
 * Basic warrior passive, не работает, нежно переделать
 */
module.exports = {
  aliases: ['второе дыхание'],
  name: 'второе дыхание',
  gender: 'neuter',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],
  effect: 'skill.secondwind',
  cooldown: interval,

  configureEffect: (effect) => {
    effect.state = Object.assign(effect.state, {
      threshold,
      restorePercent: Math.floor(SkillUtil.getBuff(player, 'skill_secondwind') * buffMod),
    });

    SkillUtil.skillUp(state, player, 'skill_secondwind');

    return effect;
  },

  info(player) {
    return `Каждые ${interval / 60} минут, когда энергия падает ниже ${threshold}%, восстанавливается часть от вашей максимальной энергии.`;
  },
};
