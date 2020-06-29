'use strict';

const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 80;

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
  cooldown: 20,

  run: state => function (args, player, target) {
    if (!target.hasAttribute('light')) {
      return B.sayAt(player, `<b>На ${target.vname} это заклинание не подействует.</b>`);
    }

    let duration = SkillUtil.effectDuration(player);

    if (target !== player) {
      B.sayAt(player, `<b>Вы вздымаете руки к небесам и ${target.name} начинает светиться.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} вздымает руки к небесам и ${target.name} начинает светиться.</b>`, [target, player]);
      B.sayAt(target, `<b>${player.Name} вздымает руки к небесам и вы начинаете светиться.</b>`);
    } else {
      B.sayAt(player, `<b>Вы вздымаете руки к небесам и вы начинаете светиться.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} вздымает руки к небесам и вы начинает светиться.</b>`, [player, target]);
    }

    const effect = state.EffectFactory.create('light', {duration}, {spellStrength: SkillUtil.getBuff(player, 'spell_light')});
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_light');
  },

  info: (player) => {
    return `Заставьте себя или товарища светиться магическим светом. Длительность эффекта зависит от вашего интеллекта и ловкости.`;
  }
};
