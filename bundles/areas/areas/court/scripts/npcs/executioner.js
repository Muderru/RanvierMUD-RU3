const { Broadcast, Damage } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      const target = [...this.combatants][0];
      const healthCurrent = target.getAttribute('health');
      const healthMax = target.getMaxAttribute('health');
      if ((healthCurrent / healthMax) < 0.3) {
        Broadcast.sayAt(target, 'Палач прекращает ваши мучения, одним ударом отрубая голову.');
        Broadcast.sayAtExcept(target.room, `Палач прекращает мучения ${target.rname}, одним ударом отрубая голову.`, target);
        const damage = new Damage('health', healthCurrent, null, this);
        damage.commit(target);
      }
    },

    deathblow: (state) => function (player) {
      Broadcast.sayAt(player.room, `Палач злорадно ухмыляется, когда обезглавленное тело ${player.rname} падает на пол.`);
    },
  },
};
