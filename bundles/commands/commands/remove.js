'use strict';

const { Broadcast, ItemType } = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');
const ItemUtil = require('../../lib/lib/ItemUtil');

module.exports = {
  aliases: [ 'снять' ],
  usage: 'снять <предмет>',
  command : state => (arg, player) => {
    if (!arg.length) {
      return Broadcast.sayAt(player, 'Что снять?');
    }

    const result = ArgParser.parseDot(arg, player.equipment, true);
    if (!result) {
      return Broadcast.sayAt(player, "На вас ничего такого не одето.");
    }

    const [slot, item] = result;
    Broadcast.sayAt(player, `<green>Вы сняли: </green>${ItemUtil.display(item)}<green>.</green>`);
    player.unequip(slot);
  }
};
