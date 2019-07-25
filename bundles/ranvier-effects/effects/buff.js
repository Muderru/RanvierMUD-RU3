'use strict';

module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Flag = require(srcPath + 'EffectFlag');

  return {
    config: {
      name: 'Усиление силы',
      description: "Вы чувствуете себя сильнее!",
      duration: 30 * 1000,
      type: 'buff.strength',
    },
    flags: [Flag.BUFF],
    state: {
      magnitude: 5
    },
    modifiers: {
      attributes: {
        strength: function (current) {
          return current + this.state.magnitude;
        }
      }
    },
    listeners: {
      effectActivated: function () {
        Broadcast.sayAt(this.target, "Ваши мышцы увеличились в размерах!");
      },

      effectDeactivated: function () {
        Broadcast.sayAt(this.target, "Вы чувствуете себя слабее.");
      }
    }
  };
};
