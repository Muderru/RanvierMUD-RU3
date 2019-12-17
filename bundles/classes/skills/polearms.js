'use strict';

const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения древковым оружием
 */
module.exports = {
  aliases: ['древковое оружие'],
  name: 'древковое оружие',
  gender: 'neuter',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info: function (player) {
    return `Позволяет вам использовать древковое оружие.`;
  }
};
