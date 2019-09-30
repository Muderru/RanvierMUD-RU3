'use strict';

const {
  Broadcast,
  Logger
} = require('ranvier');

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
    type: 'memory',
  },
  state: {
    enemyName: ''
  },
  listeners: {
    updateTick: function () {
      if (this.target.isInCombat()) {
        return;
      }

      for (const pc of this.target.room.players) {
        if (pc.name === this.state.enemyName) {
          let detectInvis = 0;
          let detectHide = 0;

          if (this.target.hasAttribute('detect_invisibility')) {
            detectInvis = this.target.getAttribute('detect_invisibility');
          }

          if (this.target.hasAttribute('detect_hide')) {
            detectHide = this.target.getAttribute('detect_hide');
          }

          if (pc.hasAttribute('invisibility') && pc.getAttribute('invisibility') <= detectInvis) {
            Broadcast.sayAt(pc, this.target.Name + " набрасывается на вас!");
            this.target.initiateCombat(pc);
          } else if (pc.hasAttribute('hide') && pc.getAttribute('hide') <= detectHide) {
            Broadcast.sayAt(pc, this.target.Name + " набрасывается на вас!");
            this.target.initiateCombat(pc);
          }
        }
      }
    },

    killed: function () {
      this.remove();
    }
  }
};
