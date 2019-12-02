'use strict';

const { Broadcast, PlayerRoles } = require('ranvier');

module.exports = {
  aliases: ['создать'],
  usage: 'create <item>',
  requiredRole: PlayerRoles.ADMIN,
  command: (state) => (args, player) => {
    if (!args || !args.length) {
      return Broadcast.sayAt(player, 'Нужно указать id предмета.');
    }

    const target = args;
    const isItem = target.includes(':');
    let targetItem = null;

    if (isItem) {
      targetItem = player.room.spawnItem(state, target);
      player.addItem(targetItem);
      Broadcast.sayAt(player, `Вы создали ${targetItem.name}.`);
    } else {
      Broadcast.sayAt(player, 'Неверный формат id предмета.');
    }

  }
};
