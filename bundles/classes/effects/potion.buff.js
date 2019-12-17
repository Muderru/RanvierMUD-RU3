'use strict';

const { Broadcast, EffectFlag } = require('ranvier');

module.exports = {
  config: {
    name: 'зелье усиления',
    gender: 'neuter',
    damageVerb: 'усиливает',
    type: 'potion.buff',
    refreshes: true,
  },
  flags: [EffectFlag.BUFF],
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
      Broadcast.sayAt(this.target, "Вы обновили действие магического зелья.");
    },

    effectActivated: function () {
      Broadcast.sayAt(this.target, "Вы осушили бутылёк с зельем и почувствовали себя сильнее!");
    },

    effectDeactivated: function () {
      Broadcast.sayAt(this.target, "Наполняющая вас сила иссякла.");
    }
  }
};

