const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    take: (state) => function (player, item) {
      state.ChannelManager.get('say').send(state, this, 'О, я так счастлив!.');

      let rand = 0;
      rand = Math.floor((Math.random() * 100) + 1);

      if (rand <= 35) {
        let bow = null;
        bow = player.room.spawnItem(state, 'theater:47737');
        player.addItem(bow);
        player.room.removeItem(bow);
        Broadcast.sayAt(player, `Фанат дал вам ${bow.vname}.`);
      }

      player.room.removeNpc(this, true);
      player.room.spawnNpc(state, 'theater:47733');
    },
  },
};
