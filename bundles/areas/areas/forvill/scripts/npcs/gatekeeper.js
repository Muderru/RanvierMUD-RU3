const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 60) {
        return;
      }

      Broadcast.sayAt(player, 'Привратник на секунду отвлекся от наблюдений и подозрительно посмотрел на вас.');
      Broadcast.sayAtExcept(player.room, `Привратник на секунду отвлекся от наблюдений и подозрительно посмотрел на ${player.Vname}.`, player);
    },
  },
};
