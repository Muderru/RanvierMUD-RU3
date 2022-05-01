const { Broadcast } = require('ranvier');
let questActive = true;

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (commandName !== 'нацепить') {
        return Broadcast.sayAt(player, 'Что?');
      }

      if (args === 'хомут' || args === 'хомут на колесо') {
        if (!player.equipment) {
          return Broadcast.sayAt(player, 'У вас этого нет.');;
        }

        const clamp = player.hasItem('tookland:34710');
        if (!clamp) {
          return Broadcast.sayAt(player, 'У нет этого.');
        }

        if (!questActive) {
          return Broadcast.sayAt(player, 'Вы попытались надеть хомут на колесо, но у вас ничего не получилось.');
        }
        Broadcast.sayAt(player, 'Вы надели хомут на мельничное колесо.');

        if (player.gender === 'male') {
          Broadcast.sayAtExcept(player.room, `${player.Name} надел хомут на мельничное колесо.`, player);
        } else if (player.gender === 'female') {
          Broadcast.sayAtExcept(player.room, `${player.Name} надела хомут на мельничное колесо.`, player);
        } else if (player.gender === 'plural') {
          Broadcast.sayAtExcept(player.room, `${player.Name} надели хомут на мельничное колесо.`, player);
        } else {
          Broadcast.sayAtExcept(player.room, `${player.Name} надело хомут на мельничное колесо.`, player);
        }

        Broadcast.sayAt(player.room, 'Вода в реке забурлила и от туда поднялась туманная фигура.');
        state.ItemManager.remove(clamp);
        player.room.spawnNpc(state, 'tookland:34711');
        questActive = false;
      } else {
        return Broadcast.sayAt(player, 'Что вы хотите надеть?');
      }
    },

    respawnTick: (state) => function () {
      questActive = true;
    },
  },
};
