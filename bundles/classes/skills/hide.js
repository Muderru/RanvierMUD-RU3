const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 20;
const manaCost = 85;

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
  cooldown,

  run: (state) => function (args, player, target) {
    const duration = SkillUtil.effectDuration(player);

    B.sayAt(player, '<b>Проявляя чудеса ловкости и находчивости, вы пытаетесь спрятаться.</b>');
    B.sayAtExcept(player.room, `<b>${player.Name} проявляет чудеса ловкости и находчивости, прячась от противника.</b>`, [player, target]);

    const effect = state.EffectFactory.create('hide', { duration }, { spellStrength: SkillUtil.getBuff(player, 'skill_hide') });
    player.addEffect(effect);

    SkillUtil.skillUp(state, player, 'skill_hide');
  },

  info: (player) => 'Слейтесь с окружением, станьте невидимы для не тренированного глаза. Длительность эффекта зависит от вашей силы и ловкости.',
};
