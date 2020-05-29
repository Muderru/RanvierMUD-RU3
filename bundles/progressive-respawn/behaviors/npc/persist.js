'use strict';

const { Logger } = require('ranvier');

//Временное решение, пока не станет понятно почему некоторые мобы исчезают и
//не респаунятся снова
module.exports = {
  listeners: {
    respawnTick: state => function () {
      if (!this.room) {
        this.sourceRoom.spawnNpc(state, this.id);
        Logger.verbose(`${this.id} has persisted.`);
      }
    }
  }
};
