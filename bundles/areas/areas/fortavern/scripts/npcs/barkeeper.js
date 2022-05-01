const { Broadcast } = require('ranvier');

let giveKey = false;

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.hasEffectType('speaking')) {
        return;
      }

      const questRef = 'fortavern:80100';
      if (!state.QuestFactory.canStart(player, questRef)) {
        return;
      }

      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          'Привет, %player%. У меня есть работенка для тебя. Интересует?',
        ],
        outputFn: (message) => {
          message = message.replace(/%player%/, player.name);
          state.ChannelManager.get('say').send(state, this, message);
        },
      });
      this.addEffect(speak);
    },

    updateTick: (state) => function () {
      const questRef = 'fortavern:80100';
      let hasKey = false;
      for (const pc of this.room.players) {
        if (pc.questTracker.isActive(questRef)) {
          if (pc.inventory) {
            for (const [, item] of pc.inventory) {
              if (item.entityReference === 'fortavern:80145') {
                hasKey = true;
              }
            }
          }
          if (!hasKey && !giveKey) {
            state.ChannelManager.get('say').send(state, this, 'Вот, тебе понадобится ключ от подвала.');
            let key = null;
            key = pc.room.spawnItem(state, 'fortavern:80145');
            giveKey = true;
            if (pc.isInventoryFull()) {
              Broadcast.sayAt(pc, 'Ваш инвентарь переполнен и вы уронили ключ на пол.');
            } else {
              pc.addItem(key);
              pc.room.removeItem(key);
              Broadcast.sayAt(pc, 'Бармен дал вам ключ от подвала.');
            }
          }
        }
      }
    },

    respawnTick: (state) => function () {
      giveKey = false;
    },

    playerLeave: (state) => function (player) {
      const speaking = this.effects.getByType('speaking');
      if (speaking) {
        speaking.remove();
      }
    },
  },
};
