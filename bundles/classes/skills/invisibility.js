const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 20;
const manaCost = 165;

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
  cooldown,

  run: (state) => function (args, player, target) {
    if (!target.hasAttribute('invisibility')) {
      return B.sayAt(player, `<b>На ${target.vname} это заклинание не подействует.</b>`);
    }

    const duration = SkillUtil.effectDuration(player);

    if (target !== player) {
      B.sayAt(player, `<b>Вы чертите в воздухе светящиеся символы, заставляя ${target.vname} исчезнуть.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} чертит в воздухе светящиеся символы, заставляя ${target.vname} исчезнуть.</b>`, [target, player]);
      B.sayAt(target, `<b>${player.Name} чертит в воздухе светящиеся символы, заставляя вас исчезнуть.</b>`);
    } else {
      B.sayAt(player, '<b>Вы чертите в воздухе светящиеся символы, заставляя себя исчезнуть.</b>');
      B.sayAtExcept(player.room, `<b>${player.Name} чертит в воздухе светящиеся символы, заставляя себя исчезнуть.</b>`, [player, target]);
    }

    const effect = state.EffectFactory.create('invisibility', { duration }, { spellStrength: SkillUtil.getBuff(player, 'spell_invisibility') });
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_invisibility');
  },

  info: (player) => 'Сделайте себя или вашего товарища невидимым. Длительность эффекта зависит от вашего интеллекта и ловкости.',
};
