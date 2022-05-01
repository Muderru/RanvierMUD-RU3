const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      const healthCurrent = this.getAttribute('health');
      const healthMax = this.getMaxAttribute('health');
      if ((healthCurrent / healthMax) < 0.3) {
        for (const npc of this.room.npcs) {
          if (npc.entityReference === 'spdfor:66714') {
            this.room.spawnNpc(state, 'spdfor:66717');
            state.MobManager.removeMob(npc);
            Broadcast.sayAtExcept(this.room, 'Одним ударом когтистой лапы королева пауков вскрыла кокон и оттуда вылез маленький паук.', this);
          }
        }
      }
    },

    deathblow: (state) => function (player) {
      Broadcast.sayAt(player.room, `Королева пауков удовлетворенно шипит, когда ${player.name} умирает от ран.`);
    },
  },
};
