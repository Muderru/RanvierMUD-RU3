const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'вставить') {
        return;
      }

      if (args !== 'ключ') {
        return Broadcast.sayAt(player, 'Что вы хотите вставить?');
      }

      const playerKey = player.hasItem('theater:47723');
      if (!playerKey) {
        return Broadcast.sayAt(player, 'У вас нет нужного ключа.');
      }

      Broadcast.sayAt(player, 'Вы вставили ключ в замочную скважину. Дверь отворилась, но ключ при этом сломался.');
      state.ItemManager.remove(playerKey);
      player.room.exits.push({ roomId: 'theater:47746', direction: 'север', inferred: true });
    },

    respawnTick: (state) => function () {
      if (this.exits.length > 1) {
        this.exits.splice(1, 1);
      }
    },

    playerEnter: (state) => function (player) {
      const playerKey = player.hasItem('theater:47723');
      if (!playerKey) {
        return;
      }
      Broadcast.sayAt(player, 'В углу вы заметили неприметную дверь, в ее скважину можно вставить ключ.');
    },
  },
};
