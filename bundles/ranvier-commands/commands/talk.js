'use strict';

module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');
  const Parser = require(srcPath + 'CommandParser').CommandParser;
  const ItemType = require(srcPath + 'ItemType');
  const Logger = require(srcPath + 'Logger');

  return {
    usage: 'приказать <нпс> <сообщение>',
    aliases: [ 'приказать' ],
    command : (state) => (args, player) => {
      if (!args.length) {
        return B.sayAt(player, 'Что и кому вы хотите приказать?');
      }

      if (!player.room) {
        return B.sayAt(player, 'Вы зависли в нигде, вы не можете говорить.');
      }

      let [ npcSearch, ...messageParts ] = args.split(' ');
      let message = messageParts.join(' ').trim();

      // allow for `talk to npc message here`
      if (npcSearch === 'to' && messageParts.length > 1) {
        npcSearch = messageParts[0];
        message = messageParts.slice(1).join(' ');
      }

      if (!npcSearch) {
        return B.sayAt(player, 'Кому вы хотите приказать?');
      }

      if (!message.length) {
        return B.sayAt(player, 'Что вы хотите приказать?');
      }

      const npc = Parser.parseDot(npcSearch, player.room.npcs);
      if (!npc) {
        return B.sayAt(player, "Вы не видите его здесь.");
      }

      B.sayAt(player, `<b><cyan>Вы приказали ${npc.dname}: '${message}'</cyan></b>`);
      if (!npc.hasBehavior('ranvier-sentient')) {
         if (npc.gender === 'male') {
           return B.sayAt(player, "Он не понимает вас.");
         } else if (npc.gender === 'female') {
           return B.sayAt(player, "Она не понимает вас.");
         } else if (npc.gender === 'plural') {
           return B.sayAt(player, "Они не понимает вас.");
         } else {
           return B.sayAt(player, "Оно не понимает вас.");
         }

      }

      npc.emit('conversation', player, message);
    }
  };
};
