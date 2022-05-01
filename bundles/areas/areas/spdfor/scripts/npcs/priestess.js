const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      const healthCurrent = this.getAttribute('health');
      const healthMax = this.getMaxAttribute('health');
      if ((healthCurrent / healthMax) < 0.8) {
        for (const item of this.room.items) {
          if (item.entityReference === 'spdfor:66728') {
            Broadcast.sayAtExcept(this.room, 'Вдруг верховная жрица взмывает руки к небу.', this);
            state.ChannelManager.get('say').send(state, this, 'Богиня! Помоги нам! Избавь от скверны неверующих!');
            Broadcast.sayAtExcept(this.room, 'В тот же миг статуя Унголиант начала оживать.', this);
            this.room.spawnNpc(state, 'spdfor:66723');
            this.room.removeItem(item);
          }
        }
      }
    },
  },
};
