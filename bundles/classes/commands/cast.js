const { Broadcast } = require('ranvier');

module.exports = {
  aliases: ['колдовать'],
  command: (state) => (args, player) => {
    let magSymbol = player.getMeta('config.магсимвол');
    if (!magSymbol) {
      magSymbol = '\'';
    }

    const re = new RegExp(regexpVal(magSymbol));
    const match = args.match(re);
    if (!match) {
      return Broadcast.sayAt(player, `Название заклинания должно быть заключено в скобки из символов ${magSymbol}.`);
    }

    if (player.hasEffectType('silence')) {
      return Broadcast.sayAt(player, '<b>Вы сейчас не можете колдовать!</b>');
    }

    const [, , spellName, targetArgs] = match;
    const spell = state.SpellManager.find(spellName);

    if (!spell) {
      return Broadcast.sayAt(player, 'Вы не знаете такого заклинания.');
    }

    function regexpVal(magSymbol) {
      const val = `^([${magSymbol}])([^\\1]+)+\\1(?:$|\\s+(.+)$)`;
      return val;
    }

    player.queueCommand({
      execute: () => {
        player.emit('useAbility', spell, targetArgs);
      },
      label: `cast ${args}`,
    }, spell.lag || state.Config.get('skillLag') || 1000);
  },
};
