const { Broadcast } = require('ranvier');
let mouseExist = true;

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (player.isInCombat()) {
        return Broadcast.sayAt(player, 'Вы сейчас сражаетесь!');
      }

      if (commandName !== 'двигать') {
        return Broadcast.sayAt(player, 'Что?');
      }


      if (!mouseExist) {
        return Broadcast.sayAt(player, 'Жернова застряли и их не сдвинуть.');
      }


      if (args === 'жернова' || args === 'жернов') {
        Broadcast.sayAt(player, 'Вы сдвинули жернова.');

        if (player.gender === 'male') {
          Broadcast.sayAtExcept(player.room, `${player.Name} сдвинул жернова.`, player);
        } else if (player.gender === 'female') {
          Broadcast.sayAtExcept(player.room, `${player.Name} сдвинула жернова.`, player);
        } else if (player.gender === 'plural') {
          Broadcast.sayAtExcept(player.room, `${player.Name} сдвинули жернова.`, player);
        } else {
          Broadcast.sayAtExcept(player.room, `${player.Name} сдвинуло жернова.`, player);
        }

        Broadcast.sayAt(player.room, 'Под ними пряталась маленькая мышка, которая тут же убежала в поле.');
        const mouse = player.room.spawnNpc(state, 'tookland:34708');
        const nextRoom = state.RoomManager.getRoom('tookland:34739');
        mouse.moveTo(nextRoom);
        mouseExist = false;
      } else {
        return Broadcast.sayAt(player, 'Что вы хотите сдвинуть?');
      }
    },

    respawnTick: (state) => function () {
      mouseExist = true;
    },
  },
};
