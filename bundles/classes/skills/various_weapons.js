'use strict';

const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения разнообразным оружием
 */
module.exports = {
  aliases: ['разнообразное оружие'],
  name: 'разнообразное оружие',
  gender: 'neither',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info: function (player) {
    return `Позволяет вам использовать разнообразное оружие.`;
  }
};
