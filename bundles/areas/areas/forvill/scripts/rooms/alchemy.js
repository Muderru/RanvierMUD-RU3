const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'заправить') {
        return;
      }

      if (args !== 'самогоном') {
        return Broadcast.sayAt(player, 'Чем вы хотите заправить алхимический аппарат?');
      }

      const hooch = player.hasItem('forvill:70512');
      if (!hooch) {
        return Broadcast.sayAt(player, 'У вас нет самогона.');
      }

      Broadcast.sayAt(player, 'Вы заправили алхимический аппарат самогоном.');
      Broadcast.sayAt(player, 'Аппарат начал тихо шипеть и выдавливать из себя какое-то зелье.');

      const rand = Math.floor((Math.random() * 3) + 1);
      let targetItem = null;
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

      switch (rand) {
        case 1:
          Broadcast.sayAt(player, 'Вы получили зелье защиты от огня.');
          Broadcast.sayAtExcept(player.room, `${player.Name} получил${ending} зелье защиты от огня.`, player);
          state.ItemManager.remove(hooch);
          targetItem = player.room.spawnItem(state, 'forvill:70541');
          player.addItem(targetItem);
          player.room.removeItem(targetItem);
          break;
        case 2:
          Broadcast.sayAt(player, 'Вы получили зелье защиты от холода.');
          Broadcast.sayAtExcept(player.room, `${player.Name} получил${ending} зелье защиты от холода.`, player);
          state.ItemManager.remove(hooch);
          targetItem = player.room.spawnItem(state, 'forvill:70542');
          player.addItem(targetItem);
          player.room.removeItem(targetItem);
          break;
        case 3:
          Broadcast.sayAt(player, 'Вы получили зелье защиты от молнии.');
          Broadcast.sayAtExcept(player.room, `${player.Name} получил${ending} зелье защиты от молнии.`, player);
          state.ItemManager.remove(hooch);
          targetItem = player.room.spawnItem(state, 'forvill:70543');
          player.addItem(targetItem);
          player.room.removeItem(targetItem);
          break;
      }
    },
  },
};
