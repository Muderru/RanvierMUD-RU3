'use strict';

const { Broadcast } = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');

module.exports = {
  usage: 'эмоция <сообщение>',
  aliases: [':', 'эмоция'],
  command: (state) => (args, player) => {
    args = args.trim();

    if (!args.length) {
      return Broadcast.sayAt(player, 'Да, но какую эмоцию вы сейчас испытываете?');
    }

    const FIND_TARGETS_REGEXP = /~((?:\d+\.)?[^\s.,!?"']+)/gi;
    const REPLACE_TARGETS_REGEXP = /~(?:\d+\.)?[^\s.,!?"']+/;

    // Build an array of items matching the emote targets (specified by ~<target> in the emote.
    let execResult;
    let matchedTargets = [];
    while ((execResult = FIND_TARGETS_REGEXP.exec(args)) !== null) {
      let targetNameFromInput = execResult[1];
      const target = findTarget(player, targetNameFromInput);
      if (!target) {
        return Broadcast.sayAt(player, `Кажется, здесь нет ${targetNameFromInput}`);
      } else {
        matchedTargets.push(target);
      }
    }

    // Replace the initial emote message with the found targets and broadcast to the room.
    const emoteMessage = matchedTargets
      .reduce((string, target) => string.replace(REPLACE_TARGETS_REGEXP, target.name), `${player.name} ${args}`)
      .replace(/([^.?!])$/, '$1.');  // Enforce punctuation

    player.room.players.forEach(presentPlayer => {
      if (presentPlayer === player) {
        Broadcast.sayAt(player, `Вы испытываете эмоцию "${emoteMessage}"`);
      } else {
        Broadcast.sayAt(presentPlayer, emoteMessage.replace(presentPlayer.name, 'вы'));
      }
    });
  }
};

function findTarget(player, thingName) {
  const findableThings = new Set([...player.room.players, ...player.equipment, ...player.room.npcs, ...player.room.items]);
  return ArgParser.parseDot(thingName, findableThings);
}