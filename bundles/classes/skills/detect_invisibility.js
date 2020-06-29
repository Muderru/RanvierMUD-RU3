'use strict';

const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 105;

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
  cooldown: 30,

  run: state => function (args, player, target) {
    if (!target.hasAttribute('detect_invisibility')) {
      return B.sayAt(player, `<b>На ${target.vname} это заклинание не подействует.</b>`);
    }

    let duration = SkillUtil.effectDuration(player);

    if (target !== player) {
      B.sayAt(player, `<b>Вы касаетесь лба ${target.rname} и его глаза вспыхивают ярким светом.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} касается лба ${target.rname} и его глаза вспыхивают ярким светом.</b>`, [target, player]);
      B.sayAt(target, `<b>${player.Name} касается вашего лба и ваши глаза вспыхивают ярким светом.</b>`);
    } else {
      B.sayAt(player, "<b>Вы касаетесь своего лба и ваши глаза вспыхивают ярким светом.</b>");
      B.sayAtExcept(player.room, `<b>${player.Name} касается своего лба и его глаза вспыхивают ярким светом.</b>`, [player, target]);
    }

    const effect = state.EffectFactory.create('detect_invisibility', {duration}, {spellStrength: SkillUtil.getBuff(player, 'spell_detect_invisibility')});
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_detect_invisibility');
  },

  info: (player) => {
    return `Позволяет вам видеть невидимых обычным глазом существ. Длительность эффекта зависит от вашего интеллекта и ловкости.`;
  }
};
