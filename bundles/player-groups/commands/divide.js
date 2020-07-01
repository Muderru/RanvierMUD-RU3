'use strict';

const { Broadcast } = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');

module.exports = {
  aliases: [ 'поделить' ],
  command: state => (arg, player) => {
    if (!arg) {
      return Broadcast.sayAt(player, `Сколько вы хотите поделить?`);
    }

    if (!isFinite(arg)) {
      return Broadcast.sayAt(player, `Нужно указать число.`);
    }

    if (!player.party) {
      return Broadcast.sayAt(player, "Вы не состоите в группе.");
    }

    const initialGold = parseInt(arg, 10);
    const divideGold = Math.floor(initialGold/player.party.size);

    let ending = '';
    if (player.gender === 'male') {
      ending = '';
    } else if (player.gender === 'female') {
      ending = 'а';
    } else if (player.gender === 'plural') {
      ending = 'и';
    } else {
      ending = 'о';
    }

    Broadcast.sayAt(player, `Вы поделили ${initialGold} золота между ${player.party.size} членами группы.`);
    Broadcast.sayAtExcept(player.party, `${player.name} поделил${ending} ${initialGold} золота между ${player.party.size} членами группы.`, player);
    let playerGold = player.getMeta('currencies.золото');
    playerGold -= (divideGold * player.party.size);
    player.setMeta('currencies.золото', playerGold);
    for (const member of player.party) {
      let memberGold = member.getMeta('currencies.золото');
      member.setMeta('currencies.золото', memberGold + divideGold);
      Broadcast.sayAt(member, `Вы получили ${divideGold} золота.`);
    }
  }
};
