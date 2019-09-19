'use strict';

const { Broadcast: B, SkillType } = require('ranvier');

const manaCost = 85;

function getSkill(player) {
  let spellStrength = 1;
  if (player.getMeta('skill_hide') > 0) {
    spellStrength = player.getMeta('skill_hide');
  }
  return spellStrength;
}

/**
 * Хайд
 */
module.exports = {
  aliases: ['спрятаться'],
  name: 'спрятаться',
  type: SkillType.SKILL,
  requiresTarget: false,
  initiatesCombat: false,
  targetSelf: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 60,

  run: state => function (args, player, target) {
    if (player.isInCombat()) {
      return B.sayAt(this, 'Вы сейчас сражаетесь!');
    }

    let duration = 0;
    if (player.hasAttribute('agility')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('agility')/10));
    }

    if (player.hasAttribute('strength')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('strength')/10));
    }

      B.sayAt(player, "<b>Проявляя чудеса ловкости и находчивости, вы сливаетесь с окружением.</b>");
      B.sayAtExcept(player.room, `<b>${player.Name} проявляет чудеса ловкости и находчивости, сливаясь с окружением.</b>`, [player, target]);

    const effect = state.EffectFactory.create('hide', {duration}, {spellStrength: getSkill(player)});
    player.addEffect(effect);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_hide') < 100) {
            let skillUp = player.getMeta('skill_hide');
            player.setMeta('skill_hide', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в умении \'Спрятаться\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Слейтесь с окружением, станьте невидимы для не тренированного глаза. Длительность эффекта зависит от вашей силы и ловкости.`;
  }
};
