'use strict';

const { Broadcast } = require('ranvier');

/**
 * Dummy effect used to enforce skill cooldowns
 */
module.exports = {
  config: {
    name: 'Cooldown',
    description: 'Задержка между применениями умений и заклинаний.',
    unique: false,
    type: 'cooldown',
  },
  state: {
    cooldownId: null
  },
  listeners: {
    effectDeactivated: function () {
      Broadcast.sayAt(this.target, `Вы снова можете использовать \'<bold>${this.skill.name}</bold>\'.`);
    }
  }
};
