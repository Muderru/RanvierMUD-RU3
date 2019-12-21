'use strict';

const { Broadcast: B, SkillType } = require('ranvier');

const manaCost = 105;

function getSkill(player) {
  let spellStrength = 1;
  if (player.getMeta('spell_detect_invisibility') > 0) {
    spellStrength = player.getMeta('spell_detect_invisibility');
  }
  return spellStrength;
}

/**
 * Невидимость
 */
module.exports = {
  aliases: ['видеть невидимое'],
  name: 'видеть невидимое',
  gender: 'neuter',
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
    if (!target.hasAttribute('detect_invisibility')) {
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
      B.sayAt(player, `<b>Вы касаетесь лба ${target.rname} и его глаза вспыхивают ярким светом.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} касается лба ${target.rname} и его глаза вспыхивают ярким светом.</b>`, [target, player]);
      B.sayAt(target, `<b>${player.Name} касается вашего лба и ваши глаза вспыхивают ярким светом.</b>`);
    } else {
      B.sayAt(player, "<b>Вы касаетесь своего лба и ваши глаза вспыхивают ярким светом.</b>");
      B.sayAtExcept(player.room, `<b>${player.Name} касается своего лба и его глаза вспыхивают ярким светом.</b>`, [player, target]);
    }

    const effect = state.EffectFactory.create('detect_invisibility', {duration}, {spellStrength: getSkill(player)});
    target.addEffect(effect);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('spell_detect_invisibility') < 100) {
            let skillUp = player.getMeta('spell_detect_invisibility');
            player.setMeta('spell_detect_invisibility', skillUp + 1);
            B.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Видеть невидимое\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Позволяет вам видеть невидимых обычным глазом существ. Длительность эффекта зависит от вашего интеллекта и ловкости.`;
  }
};
