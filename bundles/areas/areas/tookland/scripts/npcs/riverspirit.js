const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      const target = [...this.combatants][0];
      const amulet = target.hasEquippedItem('tookland:34708');
      if (amulet) {
        return;
      }

      const paralysis = state.SpellManager.get('paralysis');
      if (!paralysis.onCooldown(this) && paralysis.hasEnoughResources(this)) {
        Broadcast.sayAt(target, '<red><b>Глаза духа вспыхивают зловещим огнём и вы замираете в ужасе!</red></b>');
        paralysis.execute(null, this, target);
      }
    },
  },
};
