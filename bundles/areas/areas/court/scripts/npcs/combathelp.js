const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      if (this.getAttribute('freedom') < 0) {
        return;
      }

      if (this.hasEffectType('silence')) {
        return;
      }

      const healthCurrent = this.getAttribute('health');
      const healthMax = this.getMaxAttribute('health');
      if ((healthCurrent / healthMax) < 0.8) {
        for (const exit of this.room.exits) {
          const room = state.RoomManager.getRoom(exit.roomId);
          const guard = Array.from(room.npcs).find((npc) => npc.entityReference === 'court:40226');
          if (!guard) {
            const inguisitor = Array.from(room.npcs).find((npc) => npc.entityReference === 'court:40232');
            if (!inguisitor) {
              return;
            } else {
              state.ChannelManager.get('say').send(state, this, 'Помогите! Меня убивают!');
              inguisitor.moveTo(this.room);
              return Broadcast.sayAt(this.room, `Инквизитор прибежал на помощь ${this.dname}.`);
            }
          }
          state.ChannelManager.get('say').send(state, this, 'Помогите! Меня убивают!');
          guard.moveTo(this.room);
          Broadcast.sayAt(this.room, `Стражник прибежал на помощь ${this.dname}.`);
        }
      }
    },

  },
};
