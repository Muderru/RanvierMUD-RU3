const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 60) {
        return;
      }

      let batRoom = null;
      batRoom = state.RoomManager.getRoom('fortavern:80146');
      const bat = Array.from(batRoom.npcs).find((npc) => npc.entityReference === 'fortavern:80114');
      if (!bat) {
        return;
      }

      Broadcast.sayAt(player.room, 'Внезапно сверху послышался шум крыльев.');
      Broadcast.sayAt(player.room, 'Вас что-то схватило и потащило вверх.');
      Broadcast.sayAtExcept(player.room, `${player.Vname} что-то схватило и потащило вверх.`, player);

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('fortavern:80146');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
