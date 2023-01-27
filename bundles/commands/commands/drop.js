const { Broadcast } = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');
const ItemUtil = require('../../lib/lib/ItemUtil');

module.exports = {
  usage: 'бросить <предмет>',
  aliases: ['бросить', 'выбросить'],
  command: (state) => (args, player) => {
    args = args.trim();

    if (!args.length) {
      return Broadcast.sayAt(player, 'Что вы хотите бросить??');
    }

    if (!player.room) {
      return Broadcast.sayAt(player, 'Вы зависли в нигде, эта вещь может исчезнуть навсегда.');
    }

    const item = ArgParser.parseDot(args, player.inventory);

    if (!item) {
      return Broadcast.sayAt(player, 'У вас ничего такого нет.');
    }

    if (item.getMeta('forSell') > 0) {
      item.setMeta('forSell', 0);
    }

    if (!item.hasBehavior('decay')) {
      const delayBehavior = state.ItemBehaviorManager.get('decay');
      delayBehavior.attach(item, {duration: 1500});
    }

    player.removeItem(item);
    player.room.addItem(item);
    player.emit('drop', item);
    item.emit('drop', player);

    for (const npc of player.room.npcs) {
      npc.emit('playerDropItem', player, item);
    }

    let ending = '';
    if (player.gender === 'male') {
      ending = '';
    } else if (player.gender === 'female') {
      ending = 'а';
    } else if (player.gender === 'plural') {
      ending = 'и';
    } else {
      ending = 'о';
    }
    Broadcast.sayAtExcept(player.room, `${player.Name} выбросил${ending} ${ItemUtil.display(item, 'vname')}.`, player);
    Broadcast.sayAt(player, `<green>Вы выбросили </green>${ItemUtil.display(item, 'vname')}<green>.</green>`);
  },
};
