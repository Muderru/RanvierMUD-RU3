const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (args === 'документы') {
        return Broadcast.sayAt(player, 'Какие именно документы? Тут ими завален весь стол.');
      }

      if (args !== 'пропуск') {
        return Broadcast.sayAt(player, 'Что именно вы хотите найти?');
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

      Broadcast.sayAt(player, 'Вы начали рыться в столе в поисках пропуска.');
      Broadcast.sayAtExcept(player.room, `${player.Name} начал${ending} рыться в столе в поисках пропуска.`, player);
      const scribe = Array.from(player.room.npcs).find((npc) => npc.entityReference === 'court:40208');
      if (scribe) {
        state.ChannelManager.get('say').send(state, scribe, 'Эй! Чего ты делаешь?');
        return scribe.initiateCombat(player);
      }

      if (player.isInventoryFull()) {
        Broadcast.sayAt(pc, 'Ваш инвентарь переполнен.');
      }
      Broadcast.sayAt(player, 'В одном из ящиков стола, вы нашли его.');
      Broadcast.sayAtExcept(player.room, `${player.Name} взял${ending} пропуск из ящика стола.`, player);
      const pass = player.room.spawnItem(state, 'court:40270');
      player.addItem(pass);
      player.room.removeItem(pass);
    },

  },
};
