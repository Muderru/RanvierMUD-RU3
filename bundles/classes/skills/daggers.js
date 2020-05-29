'use strict';

const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения кинжалами
 */
module.exports = {
  aliases: ['кинжалы'],
  name: 'кинжалы',
  gender: 'plural',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info: function (player) {
    return `Позволяет вам использовать кинжалы и проникающее оружие.`;
  }
};
