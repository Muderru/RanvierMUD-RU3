const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'приобрести') {
        return;
      }

      if (args !== 'билет') {
        return Broadcast.sayAt(player, 'Что вы хотите купить?');
      }

      const playerGold = player.getMeta('currencies.золото');
      if (!playerGold || playerGold < 50) {
        return Broadcast.sayAt(player, 'У вас недостаточно денег.');
      }

      const buyer = Array.from(player.room.npcs).find((npc) => npc.entityReference === 'theater:47701');
      if (buyer) {
        return state.ChannelManager.get('say').send(state, buyer, 'Эй! Куда без очереди?');
      }

      if (player.isInventoryFull()) {
        return Broadcast.sayAt(player, 'Вы не унесете больше вещей.');
      }

      let ticket = null;
      ticket = player.room.spawnItem(state, 'theater:47735');
      player.addItem(ticket);
      player.room.removeItem(ticket);
      Broadcast.sayAt(player, 'Вы купили билет.');
      player.setMeta('currencies.золото', playerGold - 50);
    },

    channelReceive: (state) => function (say, player, message) {
      if (message === 'занято' || message === 'занимал') {
        const buyer = Array.from(player.room.npcs).find((npc) => npc.entityReference === 'theater:47701');
        player.room.removeNpc(buyer, true);
        player.room.spawnNpc(state, 'theater:47731');
        return Broadcast.sayAt(player, 'Человек из очереди недовольно забурчал.');
      }
    },
  },
};
