'use strict';

const { Broadcast } = require('ranvier');
const ArgParser = require('../../bundle-lib/lib/ArgParser');
const ItemUtil = require('../../bundle-lib/lib/ItemUtil');

module.exports = {
  usage: 'бросить <предмет>',
  aliases: ['бросить', 'выбросить'],
  command : (state) => (args, player) => {
    args = args.trim();

    if (!args.length) {
      return Broadcast.sayAt(player, 'Бросить что?');
    }

    if (!player.room) {
      return Broadcast.sayAt(player, 'Вы зависли в нигде, эта вещь может исчезнуть навсегда.');
    }

    const item = ArgParser.parseDot(args, player.inventory);

    if (!item) {
      return Broadcast.sayAt(player, "У вас ничего такого нет.");
    }

    player.removeItem(item);
    player.room.addItem(item);
    player.emit('drop', item);
    item.emit('drop', player);

    for (const npc of player.room.npcs) {
      npc.emit('playerDropItem', player, item);
    }

    Broadcast.sayAt(player, `<green>Вы выбросили: </green>${ItemUtil.display(item)}<green>.</green>`);
  }
};
