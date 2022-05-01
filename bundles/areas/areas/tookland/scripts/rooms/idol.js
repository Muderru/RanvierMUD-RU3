const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (commandName !== 'пожертвовать') {
        return Broadcast.sayAt(player, 'Что?');
      }

      if (args === 'копье' || args === 'копьё') {
        if (!player.equipment) {
          return Broadcast.sayAt(player, 'У вас этого нет.');;
        }

        let pike = player.hasItem('tookland:34707');
        if (!pike) {
          return Broadcast.sayAt(player, 'У вас нет подходящего копья.');
        }
        Broadcast.sayAt(player, 'Вы положили под идолом копье в качестве подношения.');

        if (player.gender === 'male') {
          Broadcast.sayAtExcept(player.room, `${player.Name} положил под идолом копье в качестве подношения.`, player);
        } else if (player.gender === 'female') {
          Broadcast.sayAtExcept(player.room, `${player.Name} положила под идолом копье в качестве подношения.`, player);
        } else if (player.gender === 'plural') {
          Broadcast.sayAtExcept(player.room, `${player.Name} положили под идолом копье в качестве подношения.`, player);
        } else {
          Broadcast.sayAtExcept(player.room, `${player.Name} положило под идолом копье в качестве подношения.`, player);
        }

        Broadcast.sayAt(player.room, 'Оно рассыпалось в прах и под ним обнаружился амулет.');
        state.ItemManager.remove(pike);
        const targetItem = player.room.spawnItem(state, 'tookland:34708');
      } else {
        return Broadcast.sayAt(player, 'Что вы хотите пожертвовать?');
      }
    },
  },
};
