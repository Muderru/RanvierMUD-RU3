const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'отодвинуть') {
        return;
      }

      if (args !== 'драпировки') {
        return Broadcast.sayAt(player, 'Что вы хотите отодвинуть?');
      }

      player.room.exits.push({ roomId: 'theater:47744', direction: 'восток', inferred: true });
      Broadcast.sayAt(player.room, 'За одной из драпировок обнаружилась потайная комната.');
    },

    respawnTick: (state) => function () {
      if (this.exits.length > 1) {
        this.exits.splice(1, 1);
      }
    },
  },
};
