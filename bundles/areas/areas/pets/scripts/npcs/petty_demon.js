'use strict';

const { Broadcast, Logger } = require('ranvier');

module.exports = {
  listeners: {
    spawn: state => function () {
      Broadcast.sayAt(this.room, "Мелкий демон появился из облака серы.");
    },

    updateTick: state => function () {
      if (this.isInCombat()) {
        return;
      }

      if (this.following.isInCombat()) {
        state.CommandManager.get('assist').execute(this.following.name, this);
      }
    },

  }
};
