const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения легкими доспехами
 */
module.exports = {
  aliases: ['легкие доспехи'],
  name: 'легкие доспехи',
  gender: 'plural',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info(player) {
    return 'Позволяет вам использовать легкие доспехи.';
  },
};
