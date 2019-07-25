'use strict';

module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Flag = require(srcPath + 'EffectFlag');

  return {
    config: {
      name: 'Усиление зельем',
      type: 'potion.buff',
      refreshes: true,
    },
    flags: [Flag.BUFF],
    state: {
      stat: "strength",
      magnitude: 1
    },
    modifiers: {
      attributes: function (attribute, current) {
        if (attribute !== this.state.stat) {
          return current;
        }

        return current + this.state.magnitude;
      }
    },
    listeners: {
      effectRefreshed: function (newEffect) {
        this.startedAt = Date.now();
        Broadcast.sayAt(this.target, "Вы обновили магию зелья.");
      },

      effectActivated: function () {
        Broadcast.sayAt(this.target, "Вы выпили зелье и почувствовали себя намного сильнее!");
      },

      effectDeactivated: function () {
        Broadcast.sayAt(this.target, "Действие зелья спало.");
      }
    }
  };
};

