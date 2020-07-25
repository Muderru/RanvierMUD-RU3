const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения разнообразным оружием
 */
module.exports = {
  aliases: ['разнообразное оружие'],
  name: 'разнообразное оружие',
  gender: 'neuter',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info(player) {
    return 'Позволяет вам использовать разнообразное оружие.';
  },
};
