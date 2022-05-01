const { Broadcast } = require('ranvier');

let giveKey = false;

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.hasEffectType('speaking')) {
        return;
      }

      const questRef = 'crypt:850001';
      if (!state.QuestFactory.canStart(player, questRef)) {
        return;
      }

      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          '%player%, наслышан о твоих подвигах. Не хочешь помочь нашей церкви?',
        ],
        outputFn: (message) => {
          message = message.replace(/%player%/, player.name);
          state.ChannelManager.get('say').send(state, this, message);
        },
      });
      this.addEffect(speak);
    },

    updateTick: (state) => function () {
      const questRef = 'crypt:850001';
      let hasKey = false;
      for (const pc of this.room.players) {
        if (pc.questTracker.isActive(questRef)) {
          if (pc.hasItem('crypt:850027')) {
            hasKey = true;
          }
          if (!hasKey && !giveKey) {
            state.ChannelManager.get('say').send(state, this, 'Вот, тебе понадобится ключ от склепа.');
            let key = null;
            key = pc.room.spawnItem(state, 'crypt:850027');
            giveKey = true;
            if (pc.isInventoryFull()) {
              Broadcast.sayAt(pc, 'Ваш инвентарь переполнен и вы уронили ключ на пол.');
            } else {
              pc.addItem(key);
              pc.room.removeItem(key);
              Broadcast.sayAt(pc, 'Викарий дал вам ключ от склепа.');
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
