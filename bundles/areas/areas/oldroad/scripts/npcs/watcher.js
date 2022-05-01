const { Broadcast } = require('ranvier');

let questactive1 = true;
let questactive2 = false;

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (questactive1 && !questactive2) {
        if (this.hasEffectType('speaking')) {
          return;
        }

        const speak = state.EffectFactory.create('speak', {}, {
          messageList: [
            'Хмм, новички в нашем лагере? Ну, неважно.',
            'Я тут присматриваю за пойманными варгами.',
            'Видели в лесу гоблинов на этих зверюгах?',
            'Так вот, у атамана родился очередной гениальный план,',
            'он решил, что если удастся приручить варгов, то наши',
            'разбойники начнут внушать в два раза больше страха.',
            'Только вот эти зверюги слишком дикие, чтобы быть прирученными.',
            'Узнать бы, как гоблинам удается приручить варгов.',
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
      questactive1 = true;
      questactive2 = false;
    },

    take: (state) => function (player, item) {
      if (questactive1 === false && item.id === 66811) {
        Broadcast.sayAt(player.room, 'Смотритель загона откупорил пузырек и осторожно понюхал гоблинское зелье.');
        state.ChannelManager.get('say').send(state, this, 'Нет, с этой дрянью я возиться не буду.');
        state.ChannelManager.get('say').send(state, this, 'Вот, возьми, это я у одного бродячего мага выменял.');
        Broadcast.sayAt(player, 'Смотритель загона дал вам ступку и пестик.');
        const pounder = player.room.spawnItem(state, 'oldroad:66832');
        player.addItem(pounder);
        player.room.removeItem(pounder);
        questactive2 = true;
      } else if (questactive2 === true && item.id === 66836) {
        state.ChannelManager.get('say').send(state, this, 'Ого. Ты удивляешь меня! Сейчас попробуем твое зелье.');
        Broadcast.sayAt(player.room, 'Смотритель загона привел одного из варгов и дал ему понюхать самодельное зелье.');
        Broadcast.sayAt(player.room, 'Глаза варга начали вращаться в разные стороны, а изо рта пошла пена.');
        state.ChannelManager.get('say').send(state, this, 'Он сошел с ума. Убей его!');
        player.room.spawnNpc(state, 'oldroad:66818');
        const questRef = 'oldroad:66800';
        if (state.QuestFactory.canStart(player, questRef)) {
          const quest = state.QuestFactory.create(state, questRef, player);
          player.questTracker.start(quest);
        }
      } else {
        state.ChannelManager.get('say').send(state, this, 'Мне не нужно это.');
      }
    },

    channelReceive: (state) => function (say, player, message) {
      if (message === 'узнаю' || message === 'выясню') {
        if (questactive1) {
          if (this.hasEffectType('speaking')) {
            return;
          }

          const speak = state.EffectFactory.create('speak', {}, {
            messageList: [
              'Узнаешь, значит? Ну, хорошо, попробуй.',
              'Можешь попытаться убить и обыскать гоблинов-наездников, вдруг найдешь что-нибудь.',
              'Только если тебя убьют в лесу, то никто твои останки искать не будет.',
            ],
            outputFn: (message) => {
              message = message.replace(/%player%/, player.name);
              state.ChannelManager.get('say').send(state, this, message);
            },
          });
          this.addEffect(speak);
          questactive1 = false;
          const varg = this.room.spawnNpc(state, 'oldroad:66820');
          const targetRoom = state.RoomManager.getRoom('oldroad:66814');
          varg.moveTo(targetRoom);
        } else {
          state.ChannelManager.get('say').send(state, this, 'Мне не нужна помощь.');
        }
      }
    },
  },
};
