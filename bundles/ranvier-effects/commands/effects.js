'use strict';
const humanize = (sec) => { return require('humanize-duration')(sec, { round: true }); };

module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');
  const Flag = require(srcPath + 'EffectFlag');

  return {
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
        if (effect.flags.includes(Flag.BUFF)) {
          color = 'green';
        } else if (effect.flags.includes(Flag.DEBUFF)) {
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
};
