'use strict';

const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения топорами
 */
module.exports = {
  aliases: ['топоры'],
  name: 'топоры',
  gender: 'plural',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info: function (player) {
    return `Позволяет вам использовать одноручные и двуручные топоры.`;
  }
};
