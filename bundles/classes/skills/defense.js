const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 120;
const buffMod = 0.25; // buff strength coefficient

/**
 * Свет
 */
module.exports = {
  aliases: ['защита'],
  name: 'защита',
  gender: 'female',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: false,
  targetSelf: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 20,

  run: (state) => function (args, player, target) {
    if (!target.hasAttribute('armor')) {
      return B.sayAt(player, `<b>На ${target.vname} это заклинание не подействует.</b>`);
    }

    const getAmount = Math.floor(SkillUtil.directSpellDamage(player, target, 'earth', 'defense') * buffMod);
    const duration = SkillUtil.effectDuration(player);

    let pretext = '';
    if (player.gender === 'male') {
      pretext = 'его';
    } else if (player.gender === 'female') {
      pretext = 'её';
    } else if (player.gender === 'plural') {
      pretext = 'их';
    } else {
      pretext = 'его';
    }

    if (target !== player) {
      B.sayAt(player, `<b><yellow>Вы делаете магические пассы руками и кожа ${target.rname} начинает напоминать кору.</yellow></b>`);
      B.sayAtExcept(player.room, `<b><yellow>${player.Name} делает магические пассы руками и кожа ${target.rname} начинает напоминать кору.</yellow></b>`, [target, player]);
      B.sayAt(target, `<b><yellow>${player.Name} делает магические пассы руками и ваша кожа начинает напоминать кору.</yellow></b>`);
    } else {
      B.sayAt(player, '<b><yellow>Вы делаете магические пассы руками и ваша кожа начинает напоминать кору.</yellow></b>');
      B.sayAtExcept(player.room, `<b><yellow>${player.Name} делает магические пассы руками и ${pretext} кожа начинает напоминать кору.</yellow></b>`, [player, target]);
    }

    const effect = state.EffectFactory.create('defense', { duration }, { spellStrength: getAmount });
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_defense');
  },

  info: (player) => 'Заставляет кожу цели или у вас затвердеть, увеличивая броню. Длительность эффекта зависит от вашего интеллекта и ловкости. Величина эффекта зависит от вашего урона землей, сопротивляемости урону земли цели, вашего интеллекта и степени владения заклинанием.',
};
