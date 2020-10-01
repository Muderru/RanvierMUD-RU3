const { Random } = require('rando-js');
const { Broadcast: B } = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');
const ItemUtil = require('../../lib/lib/ItemUtil');
const Crafting = require('../lib/Crafting');

module.exports = {
  aliases: ['собрать'],
  command: (state) => (args, player) => {
    if (!args || !args.length) {
      return B.sayAt(player, 'Собрать что?');
    }

    let node = ArgParser.parseDot(args, player.room.items);

    if (!node) {
      return B.sayAt(player, 'Здесь ничего такого нет.');
    }

    const resource = node.getMeta('resource');
    if (!resource) {
      return B.sayAt(player, 'Вы не можете ничего собрать из этого.');
    }

    if (!player.getMeta('resources')) {
      player.setMeta('resources', {});
    }

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
    B.sayAt(player, `${node.Name} ${resource.depletedMessage}`);
    node = null;
  },
};
