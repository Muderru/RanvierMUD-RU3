const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'разгрести') {
        return;
      }

      if (args !== 'завал') {
        return Broadcast.sayAt(player, 'Что вы хотите разгрести?');
      }

      if (player.getAttribute('agility') < 30) {
        return Broadcast.sayAt(player, 'Вам не хватает ловкости.');
      }

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

      player.room.exits.push({ roomId: 'court:40256', direction: 'вниз', inferred: true });
      Broadcast.sayAt(player, 'Вы ловко освободили люк из под камней.');
      Broadcast.sayAtExcept(player.room, `${player.Name} ловко освободил${ending} люк из под камней.`, player);
    },

    respawnTick: (state) => function () {
      if (this.exits.length > 1) {
        this.exits.splice(1, 1);
      }
    },
  },
};
