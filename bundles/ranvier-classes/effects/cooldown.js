'use strict';

/**
 * Dummy effect used to enforce skill cooldowns
 */
module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    config: {
      name: 'Задержка',
      description: 'Нельзя использовать умение пока на него действует задержка.',
      unique: false,
      type: 'cooldown',
    },
    state: {
      cooldownId: null
    },
    listeners: {
      effectDeactivated: function () {
        Broadcast.sayAt(this.target, `Теперь вы снова можете использовать <bold>${this.skill.name}</bold>.`);
      }
    }
  };
};

