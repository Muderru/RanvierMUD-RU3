'use strict';

const { Broadcast: B } = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');
const dot = ArgParser.parseDot;
const ItemUtil = require('../../lib/lib/ItemUtil');

module.exports = {
  usage: 'дать <предмет> <цель>',
  aliases: ['дать', 'отдать'],
  command: state => (args, player) => {
    if (!args || !args.length) {
      return B.sayAt(player, 'Что кому дать?');
    }

    let [ targetItem, to, targetRecip ] = args.split(' ');
    // give foo to bar
    if (to !== 'to' || !targetRecip) {
      targetRecip = to;
    }

    if (!targetRecip) {
      return B.sayAt(player, 'Кому вы хотите это отдать?');
    }

    targetItem = dot(targetItem, player.inventory);

    if (!targetItem) {
      return B.sayAt(player, 'У вас нет этого.');
    }

    // prioritize players before npcs
    let target = dot(targetRecip, player.room.players);

    if (!target) {
      target = dot(targetRecip, player.room.npcs);
      if (target) {
        const accepts = target.getBehavior('accepts');
        if (!accepts || !accepts.includes(targetItem.entityReference)) {
          return B.sayAt(player, '${target.Name} не хочет брать это.');
        }
      } 
    }

    if (!target) {
      return B.sayAt(player, 'Его здесь нет.');
    }

    if (target === player) {
      return B.sayAt(player, `<green>Вы переложили ${ItemUtil.display(targetItem)} из одной руки в другую. Отличный трюк.</green>`);
    }

    if (target.isInventoryFull()) {
      if (target.gender === 'male') {
            return B.sayAt(player, 'Он не может нести больше.');
      } else if (target.gender === 'female') {
            return B.sayAt(player, 'Она не может нести больше.');
      } else if (target.gender === 'plural') {
            return B.sayAt(player, 'Они не могут нести больше.');
      } else {
            return B.sayAt(player, 'Оно не может нести больше.');
      }
    }

    player.removeItem(targetItem);
    target.addItem(targetItem);

    B.sayAt(player, `<green>Вы дали <white>${target.dname}</white>: ${ItemUtil.display(targetItem)}.</green>`);
    if (!target.isNpc) {
      if (player.gender === 'male') {
        B.sayAt(target, `<green>${player.name} дал вам: ${ItemUtil.display(targetItem)}.</green>`);
      } else if (player.gender === 'female') {
        B.sayAt(target, `<green>${player.name} дала вам: ${ItemUtil.display(targetItem)}.</green>`);
      } else if (player.gender === 'plural') {
        B.sayAt(target, `<green>${player.name} дали вам: ${ItemUtil.display(targetItem)}.</green>`);
      } else {
        B.sayAt(target, `<green>${player.name} дало вам: ${ItemUtil.display(targetItem)}.</green>`);
      }
    }
  }
};
