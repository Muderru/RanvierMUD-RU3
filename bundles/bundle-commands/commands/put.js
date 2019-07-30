'use strict';

const { Broadcast: B, ItemType } = require('ranvier');
const ArgParser = require('../../bundle-lib/lib/ArgParser');
const dot = ArgParser.parseDot;
const ItemUtil = require('../../bundle-lib/lib/ItemUtil');

module.exports = {
  usage: 'положить <предмет> <контейнер>',
  aliases: [ 'положить' ],
  command : (state) => (args, player) => {
    args = args.trim();

    if (!args.length) {
      return B.sayAt(player, 'Что куда положить?');
    }

    // put 3.foo in bar -> put 3.foo bar -> put 3.foo into bar
    const parts = args.split(' ').filter(arg => !arg.match(/in/) && !arg.match(/into/));

    if (parts.length === 1) {
      return B.sayAt(player, "Куда вы хотите положить это?");
    }

    const fromList = player.inventory;
    const fromArg = parts[0];
    const toArg = parts[1];
    const item = dot(fromArg, fromList);
    const toContainer = dot(toArg, player.room.items) ||
                        dot(toArg, player.inventory) ||
                        dot(toArg, player.equipment);

    if (!item) {
      return B.sayAt(player, "У вас этого нет.");
    }

    if (!toContainer) {
      return B.sayAt(player, "Вы не находите здесь ничего подходящего.");
    }

    if (toContainer.type !== ItemType.CONTAINER) {
      return B.sayAt(player, `${ItemUtil.display(toContainer)} не контейнер.`);
    }

    if (toContainer.isInventoryFull()) {
      return B.sayAt(player, `${ItemUtil.display(toContainer)} больше ничего не может вместить.`);
    }

    if (toContainer.closed) {
      return B.sayAt(player, `${ItemUtil.display(toContainer)}: закрыто.`);
    }

    player.removeItem(item);
    toContainer.addItem(item);

    B.sayAt(player, `<green>Вы положили </green>${ItemUtil.display(item)}<green> в </green>${ItemUtil.display(toContainer)}<green>.</green>`);

    item.emit('put', player, toContainer);
    player.emit('put', item, toContainer);
  }
};
