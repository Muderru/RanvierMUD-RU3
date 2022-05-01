const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    spawn: (state) => function () {
      state.ChannelManager.get('say').send(state, this, 'Увы! Опасней мне твои глаза,');
      state.ChannelManager.get('say').send(state, this, 'Чем двадцать их мечей... Лишь ласково взгляни ты,');
      state.ChannelManager.get('say').send(state, this, 'И закален я против их вражды.');
    },

    channelReceive: (state) => function (say, player, message) {
      if (message === 'Дай бог, чтобы тебя не увидали.') {
        player.room.removeNpc(this, true);
        player.room.spawnNpc(state, 'theater:47736');
        Broadcast.sayAt(player, ' ');
        Broadcast.sayAt(player, 'Из зрительного зала в вас полетелели тухлые помидоры.');
        Broadcast.sayAtExcept(player.room, `Из зрительного зала в ${player.vname} полетелели тухлые помидоры.`, player);
      }
    },
  },
};
