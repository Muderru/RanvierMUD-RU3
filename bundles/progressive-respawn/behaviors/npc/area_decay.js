'use strict';

const { Logger } = require('ranvier');

module.exports = {
  listeners: {
    respawnTick: state => function () {
      Logger.verbose(`${this.id} has decayed on zone reset.`);
      state.MobManager.removeMob(this);
    }
  }
};
