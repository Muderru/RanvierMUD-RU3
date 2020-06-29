'use strict';

const { Broadcast, SkillType } = require('ranvier');

/**
 * Dummy effect used to enforce skill cooldowns
 */
module.exports = {
  config: {
    name: 'Задержка',
    description: 'Задержка между применениями умений и заклинаний.',
    unique: false,
    type: 'cooldown',
  },
  state: {
    cooldownId: null
  },
  listeners: {
    effectDeactivated: function () {
      if (this.skill.type === SkillType.SKILL) {
        Broadcast.sayAt(this.target, `Вы снова можете использовать умение \'<bold>${this.skill.name[0].toUpperCase()}${this.skill.name.slice(1)}</bold>\'.`);
      } else {
        Broadcast.sayAt(this.target, `Вы снова можете использовать заклинание \'<bold>${this.skill.name[0].toUpperCase()}${this.skill.name.slice(1)}</bold>\'.`);
      }
    }
  }
};
