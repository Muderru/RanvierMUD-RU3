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
    unique: false,
    persists: false,
    maxStacks: 5,
    tickInterval: 1,
  },
  listeners: {
    updateTick: function () {
      if (this.owner.isInCombat()) {
          return;
      }
      
      if (this.owner.room === this.playertarget.room) {
        Broadcast.sayAt(this.playertarget, this.owner.name + " набрасывается на вас!");
        this.owner.initiateCombat(this.playertarget);
      }
    },

  }
};
