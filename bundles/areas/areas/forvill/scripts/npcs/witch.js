const { Broadcast } = require('ranvier');

let questactive1 = true;
let questactive2 = false;
let playerName = '';

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (questactive1) {
        if (this.hasEffectType('speaking')) {
          return;
        }

        const speak = state.EffectFactory.create('speak', {}, {
          messageList: [
            'А, чужестранец! Не поможешь ли старой даме в одном деле? Кхе-кхе.',
          ],
          outputFn: (message) => {
            message = message.replace(/%player%/, player.name);
            state.ChannelManager.get('say').send(state, this, message);
          },
        });
        this.addEffect(speak);
      } else if (questactive2) {
        let poisonRoom = null;
        poisonRoom = state.RoomManager.getRoom('forvill:70520');
        const poisoned = poisonRoom.getMeta('poison');
        if (player.name === playerName && poisoned) {
          state.ChannelManager.get('say').send(state, this, 'Отличная работа. Вот тебе несколько золотых за труды.');
          const playerGold = player.getMeta('currencies.золото');
          player.setMeta('currencies.золото', playerGold + 100);
          questactive2 = false;
          state.ChannelManager.get('say').send(state, this, 'У меня будет для тебя есть ещё одно задание.');
          const questRef = 'forvill:70500';
          if (state.QuestFactory.canStart(player, questRef)) {
            const quest = state.QuestFactory.create(state, questRef, player);
            player.questTracker.start(quest);
          }
        }
      }
    },

    playerLeave: (state) => function (player) {
      const speaking = this.effects.getByType('speaking');
      if (speaking) {
        speaking.remove();
      }
    },

    respawnTick: (state) => function () {
      questactive1 = true;
      questactive2 = false;
      playerName = '';
      let poisonRoom = null;
      poisonRoom = state.RoomManager.getRoom('forvill:70520');
      poisonRoom.setMeta('poison', false);
    },

    take: (state) => function (player, item) {
      if (questactive1 === false && questactive2 === false) {
        state.ChannelManager.get('say').send(state, this, 'О, это именно то, что мне нужно.');
        Broadcast.sayAt(player.room, 'Ведьма с гиканьем бросилась к большому котлу у углу магазина.');
        Broadcast.sayAt(player.room, 'Она бросила в котёл комок тины и начала интенсивно перемешивать варево.');
        let poison = null;
        poison = player.room.spawnItem(state, 'forvill:70524');
        player.addItem(poison);
        player.room.removeItem(poison);
        Broadcast.sayAt(player, 'Ведьма дала вам пузырёк с ядом.');
        Broadcast.sayAtExcept(player.room, `Ведьма дала ${player.dname} пузырек с ядом.`, player);
        questactive2 = true;
        playerName = player.name;
        state.ChannelManager.get('say').send(state, this, 'Вот, подлей этот яд в поилку животным.');
        state.ChannelManager.get('say').send(state, this, 'Негодяй живет в конце северной улицы.');
      } else {
        state.ChannelManager.get('say').send(state, this, 'Мне не нужно это.');
      }
    },

    channelReceive: (state) => function (say, player, message) {
      if (message === 'помогу') {
        if (questactive1) {
          if (this.hasEffectType('speaking')) {
            return;
          }

          const speak = state.EffectFactory.create('speak', {}, {
            messageList: [
              'Спасибо, добрый человек! Один из жителей деревни не заплатил мне за зелье.',
              'А, оно ему помогло. Вот, женился недавно.',
              'Хочу ему отомстить. Потравить его скотину.',
              'Но для яда мне не хватает комочка тины. Принеси мне его.',
            ],
            outputFn: (message) => {
              message = message.replace(/%player%/, player.name);
              state.ChannelManager.get('say').send(state, this, message);
            },
          });
          this.addEffect(speak);
          questactive1 = false;
        } else {
          state.ChannelManager.get('say').send(state, this, 'Мне не нужна помощь.');
        }
      }
    },
  },
};
