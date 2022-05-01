const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (args !== 'кокон') {
        return Broadcast.sayAt(player, 'Что вы хотите разрезать?');
      }

      const cocoon = Array.from(player.room.items).find((item) => item.entityReference === 'spdfor:66727');
      if (!cocoon) {
        return Broadcast.sayAt(player, 'Тут нет кокона.');
      }
      player.room.removeItem(cocoon);
      Broadcast.sayAt(player, 'Вы разрезали кокон.');

      if (player.gender === 'male') {
        Broadcast.sayAtExcept(player.room, `${player.Name} разрезал кокон.`, player);
      } else if (player.gender === 'female') {
        Broadcast.sayAtExcept(player.room, `${player.Name} разрезала кокон.`, player);
      } else if (player.gender === 'plural') {
        Broadcast.sayAtExcept(player.room, `${player.Name} разрезали кокон.`, player);
      } else {
        Broadcast.sayAtExcept(player.room, `${player.Name} разрезало кокон.`, player);
      }

      Broadcast.sayAt(player.room, 'Из кокона вывалился изможденный человек.');
      player.room.spawnNpc(state, 'spdfor:66719');
    },
  },
};
