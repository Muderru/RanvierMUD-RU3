const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'нажать') {
        return;
      }

      if (args !== 'руку') {
        return Broadcast.sayAt(player, 'Что вы хотите нажать?');
      }

      player.room.exits.push({ roomId: 'eastroad:10980', direction: 'вниз', inferred: true });
      Broadcast.sayAt(player.room, 'Статуя сдвинулась и открыла проход вниз.');
    },

    respawnTick: (state) => function () {
      if (this.exits.length > 1) {
        this.exits.splice(3, 1);
      }
    },
  },
};
