const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 20;
const manaCost = 55;

/**
 * Хайд
 */
module.exports = {
  aliases: ['чувствовать жизнь', 'присмотреться'],
  name: 'чувствовать жизнь',
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

    B.sayAt(player, '<b>Вы начинаете усиленно всматриваться в окружающую обстановку.</b>');
    B.sayAtExcept(player.room, `<b>${player.Name} начинает усиленно всматриваться в окружающую обстановку.</b>`, [player, target]);

    const effect = state.EffectFactory.create('detect_hide', { duration }, { spellStrength: SkillUtil.getBuff(player, 'skill_detect_hide') });
    player.addEffect(effect);

    SkillUtil.skillUp(state, player, 'skill_detect_hide');
  },

  info: (player) => 'Напрягите глаза и попытайтесь отыскать спрятавшихся. Длительность эффекта зависит от вашей силы и ловкости.',
};
