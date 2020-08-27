const { Logger } = require('ranvier');

/**
 * Только для мобов, которые создаются с помощью триггера. Для других мобов
 * будут ошибки.
 */
module.exports = {
  listeners: {
    respawnTick: (state) => function () {
      Logger.verbose(`${this.id} has decayed on zone reset.`);
      this.room.removeNpc(this, true);
      state.MobManager.removeMob(this);
    },
  },
};
