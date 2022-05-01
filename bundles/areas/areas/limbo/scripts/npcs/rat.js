const { Broadcast, Logger } = require('ranvier');

module.exports = {
  listeners: {
    spawn: (state) => function () {
      Broadcast.sayAt(this.room, 'Рядом копошится крыса.');
      Logger.log(`Spawned rat into Room [${this.room.title}]`);
    },

    /**
     * Rat tries to use Rend every time it's available
     */
    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      const target = [...this.combatants][0];

      const rend = state.SkillManager.get('rend');
      // skills do both of these checks internally but I only want to send
      // this message when execute would definitely succeed
      if (!rend.onCooldown(this) && rend.hasEnoughResources(this)) {
        Broadcast.sayAt(target, 'Крыса обнажает клыки и бросается вам в горло!');
        rend.execute(null, this, target);
      }
    },

    deathblow: (state) => function (player) {
      Broadcast.sayAt(player.room, `Крыса удовлетворенно шипит, когда ${player.name} умирает от ран.`);
    },
  },
};
