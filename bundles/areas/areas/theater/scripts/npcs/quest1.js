const { Broadcast } = require('ranvier');

let questactive = true;

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (questactive) {
        if (this.hasEffectType('speaking')) {
          return;
        }

        const speak = state.EffectFactory.create('speak', {}, {
          messageList: [
            'Я пропал! Это катастрофа! Мне уже никто не поможет!',
          ],
          outputFn: (message) => {
            message = message.replace(/%player%/, player.name);
            state.ChannelManager.get('say').send(state, this, message);
          },
        });
        this.addEffect(speak);
      }
    },

    playerLeave: (state) => function (player) {
      const speaking = this.effects.getByType('speaking');
      if (speaking) {
        speaking.remove();
      }
    },

    respawnTick: (state) => function () {
      if (questactive === false) {
        questactive = true;
      }
    },

    channelReceive: (state) => function (say, player, message) {
      if (message === 'помогу') {
        if (questactive) {
          if (this.hasEffectType('speaking')) {
            return;
          }

          const speak = state.EffectFactory.create('speak', {}, {
            messageList: [
              'У нас внезапно пропала актриса и заменить её некем.',
              'Тебе нужно выучить свою роль из сценария и выступить на сцене.',
              'Не забудь костюм надеть из сундука с реквизитом.',
            ],
            outputFn: (message) => {
              message = message.replace(/%player%/, player.name);
              state.ChannelManager.get('say').send(state, this, message);
            },
          });
          this.addEffect(speak);

          if (player.isInventoryFull()) {
            return Broadcast.sayAt(player, 'Вы не унесете больше вещей.');
          }
          questactive = false;

          let scenario = null;
          scenario = player.room.spawnItem(state, 'theater:47738');
          player.addItem(scenario);
          player.room.removeItem(scenario);
          Broadcast.sayAt(player, 'Режисер дал вам сценарий.');

          let key = null;
          key = player.room.spawnItem(state, 'theater:47734');
          player.addItem(key);
          player.room.removeItem(key);
          Broadcast.sayAt(player, 'Режисер дал вам ключ от сундука с реквизитом.');
        } else {
          state.ChannelManager.get('say').send(state, this, 'Мне не нужна помощь.');
        }
      }
    },
  },
};
