const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения мечами
 */
module.exports = {
  aliases: ['мечи'],
  name: 'мечи',
  gender: 'plural',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info(player) {
    return 'Позволяет вам использовать одноручные и двуручные мечи.';
  },
};
