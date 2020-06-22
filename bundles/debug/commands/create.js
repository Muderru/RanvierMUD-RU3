'use strict';

const { Broadcast, PlayerRoles } = require('ranvier');
const EnhanceItem = require('../../lib/lib/EnhanceItem');

module.exports = {
  aliases: ['создать'],
  usage: 'create <item>',
  requiredRole: PlayerRoles.ADMIN,
  command: (state) => (args, player) => {
    if (!args || !args.length) {
      return Broadcast.sayAt(player, 'Нужно указать id предмета.');
    }

    const [target, quality ] = args.split(' ');
    const isItem = target.includes(':');
    let targetItem = null;

    if (isItem) {
      targetItem = player.room.spawnItem(state, target);
      if (!quality) {
        player.addItem(targetItem);
      } else if ( quality === 'uncommon' ) {
        player.addItem(EnhanceItem.enhance(targetItem, 'uncommon'));
      } else if ( quality === 'rare' ) {
        player.addItem(EnhanceItem.enhance(targetItem, 'rare'));
      } else if ( quality === 'epic' ) {
        player.addItem(EnhanceItem.enhance(targetItem, 'epic'));
      } else if ( quality === 'legendary' ) {
        player.addItem(EnhanceItem.enhance(targetItem, 'legendary'));
      } else if ( quality === 'artifact' ) {
        player.addItem(EnhanceItem.enhance(targetItem, 'artifact'));
      } else {
        Broadcast.sayAt(player, 'Неверный формат качества предмета.');
      }
      player.room.removeItem(targetItem);
      Broadcast.sayAt(player, `Вы создали ${targetItem.name}.`);
    } else {
      Broadcast.sayAt(player, 'Неверный формат id предмета.');
    }

  }
};
