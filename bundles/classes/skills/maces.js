'use strict';

const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения булавами
 */
module.exports = {
  aliases: ['булавы и дубины'],
  name: 'булавы и дубины',
  gender: 'plural',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info: function (player) {
    return `Позволяет вам использовать одноручные и двуручные булавы и дубины.`;
  }
};
