'use strict';

const Ranvier = require('ranvier');
const { Broadcast, Logger } = Ranvier;
const { EquipSlotTakenError } = Ranvier.EquipErrors;
const say = Broadcast.sayAt;
const ItemUtil = require('../../lib/lib/ItemUtil');
const ArgParser = require('../../lib/lib/ArgParser');

module.exports = {
  aliases: [ 'одеть', 'надеть', 'вооружиться' ],
  usage: 'надеть <предмет>',
  command : (state) => (arg, player) => {
    arg = arg.trim();

    if (player.equipment.size >= 10) {
      return Broadcast.sayAt(player, "На вас больше нет свободного места.");
    }

    if (!arg.length) {
      return say(player, 'Надеть что?');
    }

    const item = ArgParser.parseDot(arg, player.inventory);

    if (!item) {
      return say(player, "У вас ничего такого нет.");
    }

    if (!item.metadata.slot) {
      return say(player, `Вы не можете надеть ${ItemUtil.display(item)}.`);
    }

    if (item.level > player.level) {
      return say(player, "Вы не можете использовать это еще.");
    }

    try {
      player.equip(item, item.metadata.slot);
    } catch (err) {
      if (err instanceof EquipSlotTakenError) {
        const conflict = player.equipment.get(item.metadata.slot);
        return say(player, `Вам нужно сначала снять ${ItemUtil.display(conflict)}.`);
      }

      return Logger.error(err);
    }

    say(player, `<green>Вы надели:</green> ${ItemUtil.display(item)}<green>.</green>`);
  }
};
