'use strict';

const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения средними доспехами
 */
module.exports = {
  aliases: ['средние доспехи'],
  name: 'средние доспехи',
  gender: 'plural',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info: function (player) {
    return `Позволяет вам использовать средние доспехи.`;
  }
};
