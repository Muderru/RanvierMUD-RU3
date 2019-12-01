'use strict';

const { SkillFlag, SkillType } = require('ranvier');

/**
 * Пассивное умение для владения посохами
 */
module.exports = {
  aliases: ['посохи и жезлы'],
  name: 'посохи и жезлы',
  gender: 'plural',
  type: SkillType.SKILL,
  flags: [SkillFlag.PASSIVE],

  info: function (player) {
    return `Позволяет вам использовать посохи и жезлы.`;
  }
};
