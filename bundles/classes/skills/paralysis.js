'use strict';

const { Broadcast: B, SkillType } = require('ranvier');

const manaCost = 185;

function getSkill(player) {
  let spellStrength = 1;
  if (player.getMeta('spell_paralysis') > 0) {
    spellStrength = player.getMeta('spell_paralysis');
  }
  return spellStrength;
}

/**
 * Паралич
 */
module.exports = {
  aliases: ['паралич'],
  name: 'паралич',
  gender: 'male',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  targetSelf: false,
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

    if (player.hasAttribute('intellect')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('intellect')/10));
    }

      B.sayAt(player, `<b>Вы сжимаете руку в кулак, заставляя мышцы ${target.rname} деревенеть.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} сжимает руку в кулак, заставляя мышцы ${target.rname} деревенеть.</b>`, [target, player]);
      if (!target.isNpc) {
        B.sayAt(target, `<b>${player.Name} сжимает руку в кулак, заставляя ваши мышцы деревенеть.</b>`);
      }

    if (!target.hasAttribute('freedom')) {
      target.addAttribute(state.AttributeFactory.create('freedom', 0));
    }
    const effect = state.EffectFactory.create('paralysis', {duration}, {spellStrength: getSkill(player)});
    target.addEffect(effect);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('spell_paralysis') < 100) {
            let skillUp = player.getMeta('spell_paralysis');
            player.setMeta('spell_paralysis', skillUp + 1);
            B.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Паралич\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Тело противника деревенеет и теряет способность к движению. Длительность эффекта зависит от вашего интеллекта и ловкости.`;
  }
};
