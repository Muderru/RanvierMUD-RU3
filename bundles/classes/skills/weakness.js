const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 20;
const manaCost = 165;
const debuffMod = 0.60; // debuff strength coefficient

/**
 * Заклинание уменьшающее урон противника
 */
module.exports = {
  aliases: ['слабость'],
  name: 'слабость',
  gender: 'female',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  targetSelf: false,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown,

  run: (state) => function (args, player, target) {
    if (!target.hasAttribute('health')) {
      return B.sayAt(player, `<b>На ${target.vname} это заклинание не подействует.</b>`);
    }

    const getAmount = Math.floor(SkillUtil.directSpellDamage(player, target, 'chaos', 'weakness') * debuffMod);
    const duration = SkillUtil.effectDuration(player);

    let ending = '';
    if (target.gender === 'male') {
      ending = '';
    } else if (target.gender === 'female') {
      ending = 'а';
    } else if (target.gender === 'plural') {
      ending = 'и';
    } else {
      ending = 'о';
    }

    B.sayAt(player, `<b><magenta>Вы проклинаете ${target.rname} и он${ending} становится слабее.</magenta></b>`);
    B.sayAtExcept(player.room, `<b><magenta>${player.Name} проклинает ${target.rname} и он${ending} становится слабее.</magenta></b>`, [target, player]);
    if (!target.isNpc) {
      B.sayAt(target, `<b><magenta>${player.Name} проклинает вас. Вы становится слабее!</magenta></b>`);
    }

    const effect = state.EffectFactory.create('weakness', { duration }, { spellStrength: getAmount });
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_weakness');
  },

  info: (player) => 'Вы проклинаете противника и он начинает наносить меньший урон. Длительность эффекта зависит от вашего интеллекта и ловкости. Величина эффекта зависит от вашего урона хаосом, сопротивляемости урону хаоса цели, вашего интеллекта и степени владения заклинанием.',
};
