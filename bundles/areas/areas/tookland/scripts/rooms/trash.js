const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (commandName !== 'порыться') {
        return Broadcast.sayAt(player, 'Что?');
      }

      if (args === 'в хламе' || args === 'хлам') {
        const questRef = 'tookland:34701';
        if (!player.questTracker.isActive(questRef)) {
          return Broadcast.sayAt(player, 'Вы не нашли ничего полезного');
        }

        Broadcast.sayAt(player, 'Вы начали рыться в хламе.');

        if (player.gender === 'male') {
          Broadcast.sayAtExcept(player.room, `${player.Name} начал рыться в хламе.`, player);
        } else if (player.gender === 'female') {
          Broadcast.sayAtExcept(player.room, `${player.Name} начала рыться в хламе.`, player);
        } else if (player.gender === 'plural') {
          Broadcast.sayAtExcept(player.room, `${player.Name} начали рыться в хламе.`, player);
        } else {
          Broadcast.sayAtExcept(player.room, `${player.Name} начало рыться в хламе.`, player);
        }

        Broadcast.sayAt(player.room, 'Среди груды мусора нашёлся хомут.');
        const targetItem = player.room.spawnItem(state, 'tookland:34710');
        player.addItem(targetItem);
        player.room.removeItem(targetItem);
      } else {
        return Broadcast.sayAt(player, 'Где вы хотите порыться?');
      }
    },
  },
};
