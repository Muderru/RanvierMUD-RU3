'use strict';

const { Broadcast } = require('ranvier');

/**
 * Накладываем эффект на моба с именем обидчика, если видим его, то атакуем
 */
module.exports = {
  config: {
    name: 'Память',
    description: 'Запоминается на некоторое время противник.',
    duration: 1000 * 60 * 15,
    hidden: true,
    unique: true,
    type: 'memory',
  },
  listeners: {
    updateTick: function () {
      if (this.enemy.isInCombat()) {
          return;
      }
      
      if (this.target.room === this.enemy.room) {
        Broadcast.sayAt(this.target, this.enemy.Name + " набрасывается на вас!");
        this.enemy.initiateCombat(this.target);
      }
    },

    killed: function () {
      this.remove();
    }
  }
};
