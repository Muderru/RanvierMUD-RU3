'use strict';

const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения тяжелыми доспехами
 */
module.exports = {
  aliases: ['тяжёлые доспехи'],
  name: 'тяжёлые доспехи',
  gender: 'plural',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info: function (player) {
    return `Позволяет вам использовать тяжёлые доспехи.`;
  }
};
