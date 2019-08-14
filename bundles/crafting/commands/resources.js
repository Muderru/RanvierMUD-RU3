'use strict';

const { Broadcast: B } = require('ranvier');
const Crafting = require('../lib/Crafting');
const ItemUtil = require('../../lib/lib/ItemUtil');

module.exports = {
  aliases: [ 'ресурсы', 'материалы' ],
  command: state => (args, player) => {
    const playerResources = player.getMeta('resources');

    if (!playerResources) {
      return B.sayAt(player, "У вас нет никаких ресурсов.");
    }

    B.sayAt(player, '<b>Ресурсы</b>');
    B.sayAt(player, B.line(40));
    let totalAmount = 0;
    for (const resourceKey in playerResources) {
      const amount = playerResources[resourceKey];
      totalAmount += amount;

      const resItem = Crafting.getResourceItem(resourceKey);
      B.sayAt(player, `${ItemUtil.display(resItem)} x ${amount}`);
    }

    if (!totalAmount) {
      return B.sayAt(player, "Вы не собрали никаких ресурсов.");
    }
  }
};
