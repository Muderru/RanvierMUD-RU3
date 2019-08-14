'use strict';

const { Broadcast } = require('ranvier');
const ItemUtil = require('../../lib/lib/ItemUtil');

module.exports = {
  aliases: ['экипировка', 'снаряжение'],
  usage: 'экипировка',
  command: (state) => (args, player) => {
    if (!player.equipment.size) {
      return Broadcast.sayAt(player, "На вас ничего не одето!");
    }

    Broadcast.sayAt(player, "На вас надето:");
    for (const [slot, item] of player.equipment) {
      Broadcast.sayAt(player, `  <${slot}> ${ItemUtil.display(item)}`);
    }
  }
};
