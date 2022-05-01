const { Broadcast } = require('ranvier');

let golem = false;

module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (!this.isInCombat()) {
        return;
      }

      const healthCurrent = this.getAttribute('health');
      const healthMax = this.getMaxAttribute('health');
      if ((healthCurrent / healthMax) < 0.9) {
        if (!golem) {
          Broadcast.sayAtExcept(this.room, 'Загадочный посетитель начал делать в воздухе странные пассы.', this);
          Broadcast.sayAtExcept(this.room, 'Загадочный посетитель произнес магические слова: \'creatio golem\'.', this);
          Broadcast.sayAtExcept(this.room, 'Книги, канделябры, стулья и прочий хлам начал формировать огромную фигуру.', this);
          this.room.spawnNpc(state, 'court:40230');
          golem = true;
        }
      }
    },

    respawnTick: (state) => function () {
      golem = false;
    },
  },
};
