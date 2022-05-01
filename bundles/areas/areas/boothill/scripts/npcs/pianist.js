const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.hasEffectType('speaking')) {
        return;
      }

      let rand = 0;
      rand = Math.floor((Math.random() * 4) + 1);
      let song = `Пианистка начала наигрывать грязные частушки про ${player.vname}.`;
      switch (rand) {
        case 1:
          song = `Пианистка начала наигрывать грязные частушки про ${player.vname}.`;
          break;
        case 2:
          song = `Пианистка начала играть любовную балладу про ${player.vname}.`;
          break;
        case 3:
          song = `Пианистка начала исполнять классическую мелодию про ${player.vname}.`;
          break;
        case 4:
          song = `Пианистка начала исполнять популярную песню про ${player.vname}.`;
          break;
      }

      const speak = state.EffectFactory.create('speak', {}, {
        messageList: [
          'Заходи, %player%.',
          'Возьми себе выпить чего-нибудь, а я пока для тебя сыграю.',
        ],
        outputFn: (message) => {
          message = message.replace(/%player%/, player.name);
          state.ChannelManager.get('say').send(state, this, message);
        },
      });
      this.addEffect(speak);
      const thisRoom = this.room;
      setTimeout(() => {
        Broadcast.sayAt(thisRoom, song);
      }, 6100);
    },

    playerLeave: (state) => function (player) {
      const speaking = this.effects.getByType('speaking');
      if (speaking) {
        speaking.remove();
      }
    },
  },
};
