const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'сорвать') {
        return;
      }

      if (args !== 'паутину') {
        return Broadcast.sayAt(player, 'Что вы хотите сорвать?');
      }

      const web = Array.from(player.room.items).find((item) => item.entityReference === 'spdfor:66743');
      if (!web) {
        return Broadcast.sayAt(player, 'Тут нет паутины.');
      }
      player.room.removeItem(web);
      Broadcast.sayAt(player, 'Вы сорвали паутину.');

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
      Broadcast.sayAtExcept(player.room, `${player.Name} сорвал${ending} паутину.`, player);
      Broadcast.sayAt(player.room, 'Из глубины туннеля появились встревоженные пауки.');
      player.room.spawnNpc(state, 'spdfor:66706');
      player.room.spawnNpc(state, 'spdfor:66706');
    },
  },
};
