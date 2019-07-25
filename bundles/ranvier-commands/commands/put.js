'use strict';

module.exports = (srcPath, bundlePath) => {
  const B = require(srcPath + 'Broadcast');
  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const ItemType = require(srcPath + 'ItemType');
  const ItemUtil = require(bundlePath + 'ranvier-lib/lib/ItemUtil');

  return {
    usage: 'положить <предмет> <контейнер>',
    aliases: [ "положить" ],
    command : (state) => (args, player) => {
      args = args.trim();

      if (!args.length) {
        return B.sayAt(player, 'Что куда положить?');
      }

      // put 3.foo in bar -> put 3.foo bar -> put 3.foo into bar
      const parts = args.split(' ').filter(arg => !arg.match(/в/));

      if (parts.length === 1) {
        return B.sayAt(player, "Куда вы хотите положить это?");
      }

      const fromList = player.inventory;
      const fromArg = parts[0];
      const toArg = parts[1];
      const item = Parser.parseDot(fromArg, fromList);
      const toContainer = Parser.parseDot(toArg, player.room.items) ||
                          Parser.parseDot(toArg, player.inventory) ||
                          Parser.parseDot(toArg, player.equipment);

      if (!item) {
        return B.sayAt(player, "У вас этого нет.");
      }

      if (!toContainer) {
        return B.sayAt(player, "Вы не находите здесь ничего такого.");
      }

      if (toContainer.type !== ItemType.CONTAINER) {
        return B.sayAt(player, `${ItemUtil.display(toContainer)} не контейнер.`);
      }

      if (toContainer.isInventoryFull()) {
        return B.sayAt(player, `${ItemUtil.display(toContainer)} больше ничего не может вместить.`);
      }

      if (toContainer.closed) {
        return B.sayAt(player, `${ItemUtil.display(toContainer)} закрыт.`);
      }

      player.removeItem(item);
      toContainer.addItem(item);

      B.sayAt(player, `<green>Вы положили </green>${ItemUtil.display(item)}<green> в </green>${ItemUtil.display(toContainer)}<green>.</green>`);

      item.emit('put', player, toContainer);
      player.emit('put', item, toContainer);
    }
  };
};
