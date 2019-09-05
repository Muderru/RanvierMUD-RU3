'use strict';

const humanize = (sec) => { return require('humanize-duration')(sec, { language: 'ru', round: true }); };
const { Broadcast: B, EffectFlag } = require('ranvier');

module.exports = {
  aliases: [ 'аффекты', 'эффекты' ],
  command : (state) => (args, player) => {
    B.sayAt(player, "Текущие аффекты:");

    const effects = player.effects.entries().filter(effect => {
      return !effect.config.hidden;
    });

    if (!effects.length) {
      return B.sayAt(player, "  Нет.");
    }

    for (const effect of effects) {
      let color = 'white';
      if (effect.flags.includes(EffectFlag.BUFF)) {
        color = 'green';
      } else if (effect.flags.includes(EffectFlag.DEBUFF)) {
        color = 'red';
      }
      B.at(player, `<bold><${color}>  ${effect.name}</${color}></bold>`);
      if (effect.config.maxStacks) {
        B.at(player, ` (${effect.state.stacks || 1})`);
      }

      B.at(player, ':');

      if (effect.duration === Infinity) {
        B.sayAt(player, "Постоянно");
      } else {
        B.sayAt(player, ` ${humanize(effect.remaining)} осталось`);
      }
      B.sayAt(player, "\t" + effect.description);
    }
  }
};
