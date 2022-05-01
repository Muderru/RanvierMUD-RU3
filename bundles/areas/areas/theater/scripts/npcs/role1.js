module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (!player.equipment) {
        return;
      }

      let breast = false;
      let head = false;

      for (const [slot, item] of player.equipment) {
        if (item.name === 'накладная грудь') {
          breast = true;
        } else if (item.name === 'парик') {
          head = true;
        }
      }

      if (breast && head) {
        state.ChannelManager.get('say').send(state, this, 'На легких крыльях страсти через эту');
        state.ChannelManager.get('say').send(state, this, 'Я стену перенесся... Удержать ли');
        state.ChannelManager.get('say').send(state, this, 'Любовь преградам каменным?.. Она');
        state.ChannelManager.get('say').send(state, this, 'Что может сделать, то и смеет сделать;');
        state.ChannelManager.get('say').send(state, this, 'И нет мне нужды до твоих родных!');
      }
    },

    channelReceive: (state) => function (say, player, message) {
      if (message === 'Тебя убьют они, коли увидят.') {
        player.room.removeNpc(this, true);
        player.room.spawnNpc(state, 'theater:47735');
      }
    },
  },
};
