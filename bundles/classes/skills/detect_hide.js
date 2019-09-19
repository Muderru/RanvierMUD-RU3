'use strict';

const { Broadcast: B, SkillType } = require('ranvier');

const manaCost = 65;

function getSkill(player) {
  let spellStrength = 1;
  if (player.getMeta('skill_detect_hide') > 0) {
    spellStrength = player.getMeta('skill_detect_hide');
  }
  return spellStrength;
}

/**
 * Хайд
 */
module.exports = {
  aliases: ['чувствовать жизнь'],
  name: 'чувствовать жизнь',
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
    let duration = 0;
    if (player.hasAttribute('agility')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('agility')/10));
    }

    if (player.hasAttribute('strength')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('strength')/10));
    }

      B.sayAt(player, "<b>Вы начинаете усиленно всматриваться в окружающую обстановку.</b>");
      B.sayAtExcept(player.room, `<b>${player.Name} начинает усиленно всматриваться в окружающую обстановку.</b>`, [player, target]);

    const effect = state.EffectFactory.create('detect_hide', {duration}, {spellStrength: getSkill(player)});
    player.addEffect(effect);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_detect_hide') < 100) {
            let skillUp = player.getMeta('skill_detect_hide');
            player.setMeta('skill_detect_hide', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в умении \'Чувствовать жизнь\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Напрягите глаза и попытайтесь отыскать спрятавшихся. Длительность эффекта зависит от вашей силы и ловкости.`;
  }
};
