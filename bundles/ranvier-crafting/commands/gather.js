'use strict';

module.exports = (srcPath, bundlePath) => {
  const B = require(srcPath + 'Broadcast');
  const { CommandParser } = require(srcPath + 'CommandParser');
  const Random = require(srcPath + 'RandomUtil');
  const Crafting = require(bundlePath + 'ranvier-crafting/lib/Crafting');
  const ItemUtil = require(bundlePath + 'ranvier-lib/lib/ItemUtil');

  return {
    aliases: ['собрать'],
    command: state => (args, player) => {
      if (!args || !args.length) {
        return B.sayAt(player, "Собрать что?");
      }

      let node = CommandParser.parseDot(args, player.room.items);

      if (!node) {
        return B.sayAt(player, "Здесь ничего такого нет.");
      }

      const resource = node.getBehavior('resource');
      if (!resource) {
        return B.sayAt(player, "Вы не можете ничего собрать из этого.");
      }

      if (!player.getMeta('resources')) {
        player.setMeta('resources', {});
      }

      let result = [];
      for (const material in resource.materials) {
        const entry = resource.materials[material];
        const amount = Random.inRange(entry.min, entry.max);
        if (amount) {
          const resItem = Crafting.getResourceItem(material);
          const metaKey = `resources.${material}`;
          player.setMeta(metaKey, (player.getMeta(metaKey) || 0) + amount);
          B.sayAt(player, `<green>Вы собрали: ${ItemUtil.display(resItem)} x${amount}.`);
        }
      }

      // destroy node, will be respawned
      state.ItemManager.remove(node);
      B.sayAt(player, `${ItemUtil.display(node)} ${resource.depletedMessage}`);
      node = null;
    }
  };
};
