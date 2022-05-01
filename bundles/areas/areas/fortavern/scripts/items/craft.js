const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'закрепить') {
        return;
      }

      if (args !== 'символы') {
        return Broadcast.sayAt(player, 'Что вы хотите закрепить?');
      }

      if (!player.inventory) {
        return Broadcast.sayAt(player, 'У вас нет символов.');
      }

      let hasStar = false;
      let hasMoon = false;
      for (const [, item] of player.inventory) {
        if (item.entityReference === 'fortavern:80139') {
          hasMoon = true;
        } else if (item.entityReference === 'fortavern:80140') {
          hasStar = true;
        }
      }

      if (!hasStar) {
        return Broadcast.sayAt(player, 'У вас нет золотой звезды.');
      }

      if (!hasMoon) {
        return Broadcast.sayAt(player, 'У вас нет серебряного полумесяца.');
      }

      let craftItem = null;
      let ingr1 = null;
      let ingr2 = null;
      let ingr3 = null;
      ingr1 = player.hasItem('fortavern:80139');
      ingr2 = player.hasItem('fortavern:80140');
      ingr3 = player.hasItem('fortavern:80138');
      state.ItemManager.remove(ingr1);
      state.ItemManager.remove(ingr2);
      state.ItemManager.remove(ingr3);
      craftItem = player.room.spawnItem(state, 'fortavern:80141');
      player.addItem(craftItem);
      player.room.removeItem(craftItem);

      Broadcast.sayAt(player, 'Вы украсили шелковые рукава эмблемами золотой звезды и серебряного полумесяца.');
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
      Broadcast.sayAtExcept(player.room, `${player.Name} украсил${ending} шелковые рукава эмблемами золотой звезды и серебряного полумесяца.`, player);
    },
  },
};
