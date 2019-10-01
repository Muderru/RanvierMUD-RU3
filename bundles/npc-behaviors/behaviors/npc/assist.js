'use strict';

const { Broadcast, Logger } = require('ranvier');

/**
 * Поведение для помощи другим мобам
 */
module.exports = {
  listeners: {
    updateTick: state => function () {
      if (this.isInCombat()) {
        return;
      }

      if (this.hasAttribute('freedom') && this.getAttribute('freedom') < 0) {
        return;
      }


      for (const npc of this.room.npcs) {
        if (npc.isInCombat()) {
          const target = [...npc.combatants][0];

          if (target.isNpc) {
            return;
          }

          this.initiateCombat(target, 150);
          Broadcast.sayAt(this.room, `${this.Name} бросается на помощь ${npc.dname}.`);
//          Logger.verbose(`NPC [${this.uuid}] assist [${npc.uuid}].`);

          return;

        }
      }
    }
  }
};
