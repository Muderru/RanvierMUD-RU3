'use strict';

module.exports = (srcPath, bundlePath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const ItemUtil = require(bundlePath + 'ranvier-lib/lib/ItemUtil');

  return {
    aliases: ['экипировка', 'снаряжение'],
    usage: 'экипировка',
    command: (state) => (args, player) => {
      if (!player.equipment.size) {
        return Broadcast.sayAt(player, "На вас ничего не одето!");
      }

      Broadcast.sayAt(player, "Экипировка:");
      for (const [slot, item] of player.equipment) {
        Broadcast.sayAt(player, `  <${slot}> ${ItemUtil.display(item)}`);
      }
    }
  };
};
