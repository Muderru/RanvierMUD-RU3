const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'переправиться') {
        return;
      }

      const playerGold = player.getMeta('currencies.золото');
      if (!playerGold || playerGold < 100) {
        return Broadcast.sayAt(player, 'У вас недостаточно денег.');
      }

      const ferryman = Array.from(player.room.npcs).find((npc) => npc.entityReference === 'tookland:34707');
      if (!ferryman) {
        return Broadcast.sayAt(player, 'Тут нет паромщика.');
      }

      player.setMeta('currencies.золото', playerGold - 100);
      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('arlend:pier');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
      Broadcast.sayAt(player, 'Вы переправились в Арленд.');
    },
  },
};
