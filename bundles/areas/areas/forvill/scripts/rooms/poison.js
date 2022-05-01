const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'подлить') {
        return;
      }

      if (args !== 'яд в поилку') {
        return Broadcast.sayAt(player, 'Что и куда вы хотите подлить?');
      }

      if (!player.inventory) {
        return Broadcast.sayAt(player, 'У вас нет яда.');
      }

      let hasPoison = false;
      for (const [, item] of player.inventory) {
        if (item.name === 'пузырек с ядом') {
          hasPoison = true;
          state.ItemManager.remove(item);
        }
      }

      if (!hasPoison) {
        return Broadcast.sayAt(player, 'У вас нет яда.');
      }

      Broadcast.sayAt(player, 'Вы вылили содержимое пузырька с ядом в поилку для животных.');
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
      Broadcast.sayAtExcept(player.room, `${player.Name} вылил${ending} содержимое пузырька с ядом в поилку для животных.`, player);
      this.setMeta('poison', true);
    },
  },
};
