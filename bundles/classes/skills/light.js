'use strict';

const { Broadcast: B, SkillType } = require('ranvier');

const manaCost = 80;

function getSkill(player) {
  let spellStrength = 1;
  if (player.getMeta('spell_light') > 0) {
    spellStrength = player.getMeta('spell_light');
  }
  return spellStrength;
}

/**
 * Свет
 */
module.exports = {
  aliases: ['свет'],
  name: 'свет',
  gender: 'male',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: false,
  targetSelf: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 50,

  run: state => function (args, player, target) {
    let duration = 0;
    if (player.hasAttribute('agility')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('agility')/10));
    }

    if (player.hasAttribute('intellect')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('intellect')/10));
    }

    if (target !== player) {
      B.sayAt(player, `<b>Вы вздымаете руки к небесам и ${target.name} начинает светиться.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} вздымает руки к небесам и ${target.name} начинает светиться.</b>`, [target, player]);
      B.sayAt(target, `<b>${player.Name} вздымает руки к небесам и вы начинаете светиться.</b>`);
    } else {
      B.sayAt(player, `<b>Вы вздымаете руки к небесам и вы начинаете светиться.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} вздымает руки к небесам и вы начинает светиться.</b>`, [player, target]);
    }

    const effect = state.EffectFactory.create('light', {duration}, {spellStrength: getSkill(player)});
    target.addEffect(effect);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('spell_light') < 100) {
            let skillUp = player.getMeta('spell_light');
            player.setMeta('spell_light', skillUp + 1);
            B.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Свет\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Заставьте себя или товарища светиться магическим светом. Длительность эффекта зависит от вашего интеллекта и ловкости.`;
  }
};
