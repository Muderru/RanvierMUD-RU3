'use strict';

const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения луками и арбалетами
 */
module.exports = {
  aliases: ['луки и арбалеты'],
  name: 'луки и арбалеты',
  gender: 'plural',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info: function (player) {
    return `Позволяет вам использовать луки и арбалеты.`;
  }
};
