const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    spawn: (state) => function () {
      state.ChannelManager.get('say').send(state, this, 'От взоров их я скрыт покровом ночи.');
      state.ChannelManager.get('say').send(state, this, 'А если ты меня не любишь, - мне все');
      state.ChannelManager.get('say').send(state, this, 'Равно тогда, хотя б и увидали!');
      state.ChannelManager.get('say').send(state, this, 'Конца своей я жизни от вражды их');
      state.ChannelManager.get('say').send(state, this, 'Желаю лучше, чем отсрочки смерти');
      state.ChannelManager.get('say').send(state, this, 'Холодностью твоею...');
    },

    channelReceive: (state) => function (say, player, message) {
      if (message === 'Кто сюда дорогу указал тебе?') {
        player.room.removeNpc(this, true);
        player.room.spawnNpc(state, 'theater:47737');
        Broadcast.sayAt(player, ' ');
        Broadcast.sayAt(player, 'Из зрительного зала раздался недовольный ропот по поводу вашей игры.');
        Broadcast.sayAtExcept(player.room, `Из зрительного зала по поводу игры ${player.rname} раздался недовольный ропот.`, player);
      }
    },
  },
};
