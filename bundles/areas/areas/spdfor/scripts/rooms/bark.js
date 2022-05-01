const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'сорвать') {
        return;
      }

      if (args !== 'кору') {
        return Broadcast.sayAt(player, 'Что вы хотите сорвать?');
      }

      if (player.isInventoryFull()) {
        return Broadcast.sayAt(player, 'Вы не унесете больше вещей.');
      }

      let bark = null;
      bark = player.room.spawnItem(state, 'spdfor:66716');
      player.addItem(bark);
      player.room.removeItem(bark);
      Broadcast.sayAt(player, 'Вы сорвали большой кусок коры.');

      let ending = '';
      if (player.gender === 'male') {
        ending = '';
      } else if (player.gender === 'female') {
        ending = 'а';
      } else if (player.gender === 'plural') {
        ending = 'и';
      } else {
        ending = 'о';
      }
      Broadcast.sayAtExcept(player.room, `${player.Name} сорвал${ending} большой кусок коры.`, player);
    },
  },
};
