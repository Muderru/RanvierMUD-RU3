'use strict';

const { Broadcast: B, SkillType } = require('ranvier');

const manaCost = 180;

function getSkill(player) {
  let spellStrength = 1;
  if (player.getMeta('spell_silence') > 0) {
    spellStrength = player.getMeta('spell_silence');
  }
  return spellStrength;
}

/**
 * Молчание
 */
module.exports = {
  aliases: ['молчание'],
  name: 'молчание',
  gender: 'neuter',
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

    if (!player.isNpc) {
      let rnd = Math.floor(Math.random() * 101);
      if (rnd > 95) {
        if (player.getMeta('spell_silence') < 100) {
          let skillUp = player.getMeta('spell_silence');
          player.setMeta('spell_silence', skillUp + 1);
          B.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Молчание\'.</cyan></bold>');
        }
      }
      let chance = Math.floor(Math.random()*101);
      if (chance >= getSkill(player)) {
        return B.sayAt(player, 'Вам не удалось замолчать ${target.vname}.');
      }
    }

    B.sayAt(player, `<b>Вы сжимаете руки в кулаки, заставляя ${target.vname} замолчать.</b>`);
    B.sayAtExcept(player.room, `<b>${player.Name} сжимает руки в кулаки, заставляя ${target.vname} замолчать.</b>`, [target, player]);
    B.sayAt(target, `<b>${player.Name} сжимает руки в кулаки, заставляя вас замолчать.</b>`);

    const effect = state.EffectFactory.create('silence', {duration});
    target.addEffect(effect);
  },

  info: (player) => {
    return `Делает противника немым, как рыба. Шанс срабатывания зависит от раскачки умения.`;
  }
};
