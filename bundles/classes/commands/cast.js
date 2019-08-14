'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  aliases: [ "колдовать" ],
  command : state => (args, player) => {
    // match cast "fireball" target
    const match = args.match(/^(['"])([^\1]+)+\1(?:$|\s+(.+)$)/);
    if (!match) {
      return Broadcast.sayAt(player, "Название заклинания должно быть заключено в скобки 'fireball' ЦЕЛЬ ЗАКЛИНАНИЯ.");
    }

    const [ , , spellName, targetArgs] = match;
    const spell = state.SpellManager.find(spellName);

    if (!spell) {
      return Broadcast.sayAt(player, "Вы не знаете такого заклинания.");
    }

    player.queueCommand({
      execute: _ => {
        player.emit('useAbility', spell, targetArgs);
      },
      label: `cast ${args}`,
    }, spell.lag || state.Config.get('skillLag') || 1000);
  }
};
