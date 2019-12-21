'use strict';

const { Broadcast: B, SkillType } = require('ranvier');

const manaCost = 165;

function getSkill(player) {
  let spellStrength = 1;
  if (player.getMeta('spell_invisibility') > 0) {
    spellStrength = player.getMeta('spell_invisibility');
  }
  return spellStrength;
}

/**
 * Невидимость
 */
module.exports = {
  aliases: ['невидимость'],
  name: 'невидимость',
  gender: 'female',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: false,
  targetSelf: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 60,

  run: state => function (args, player, target) {
    if (!target.hasAttribute('invisibility')) {
      return B.sayAt(player, `<b>На ${target.vname} это заклинание не подействует.</b>`);
    }

    let duration = 0;
    if (player.hasAttribute('agility')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('agility')/10));
    }

    if (player.hasAttribute('intellect')) {
        duration += 3000*(1 + Math.floor(player.getAttribute('intellect')/10));
    }

    if (target !== player) {
      B.sayAt(player, `<b>Вы чертите в воздухе светящиеся символы, заставляя ${target.vname} исчезнуть.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} чертит в воздухе светящиеся символы, заставляя ${target.vname} исчезнуть.</b>`, [target, player]);
      B.sayAt(target, `<b>${player.Name} чертит в воздухе светящиеся символы, заставляя вас исчезнуть.</b>`);
    } else {
      B.sayAt(player, "<b>Вы чертите в воздухе светящиеся символы, заставляя себя исчезнуть.</b>");
      B.sayAtExcept(player.room, `<b>${player.Name} чертит в воздухе светящиеся символы, заставляя себя исчезнуть.</b>`, [player, target]);
    }

    const effect = state.EffectFactory.create('invisibility', {duration}, {spellStrength: getSkill(player)});
    target.addEffect(effect);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('spell_invisibility') < 100) {
            let skillUp = player.getMeta('spell_invisibility');
            player.setMeta('spell_invisibility', skillUp + 1);
            B.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Невидимость\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Сделайте себя или вашего товарища невидимым. Длительность эффекта зависит от вашего интеллекта и ловкости.`;
  }
};
