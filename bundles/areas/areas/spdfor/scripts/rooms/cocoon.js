const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'разрезать') {
        return;
      }

      if (args !== 'кокон') {
        return Broadcast.sayAt(player, 'Что вы хотите разрезать?');
      }

      const cocoon = Array.from(player.room.items).find((item) => item.entityReference === 'spdfor:66724');
      if (!cocoon) {
        return Broadcast.sayAt(player, 'Тут нет кокона.');
      }
      player.room.removeItem(cocoon);
      Broadcast.sayAt(player, 'Вы разрезали кокон.');

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
      Broadcast.sayAtExcept(player.room, `${player.Name} разрезал${ending} кокон.`, player);
      Broadcast.sayAt(player.room, 'Из него вывалился человеческий труп и немного монет.');
      player.room.spawnItem(state, 'spdfor:66725');
      player.room.spawnItem(state, 'spdfor:66726');
    },
  },
};
