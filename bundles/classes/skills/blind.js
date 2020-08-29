const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 30;
const manaCost = 150;
const debuffMod = 0.1; // debuff strength coefficient

/**
 * Слепота
 */
module.exports = {
  aliases: ['слепота'],
  name: 'слепота',
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
    const getAmount = Math.floor(SkillUtil.directSpellDamage(player, target, 'chaos', 'blind') * debuffMod);
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


    B.sayAt(player, `<b><cyan>Вы бросаете магический песок в глаза ${target.rname}, он${ending} начинает хуже видеть.</cyan></b>`);
    B.sayAtExcept(player.room, `<b><cyan>${player.Name} бросает магический песок в глаза ${target.rname}, он${ending} начинает хуже видеть.</cyan></b>`, [target, player]);
    if (!target.isNpc) {
      B.sayAt(target, `<b><cyan>${player.Name} бросает магический песок вам в глаза, вы начинаете хуже видеть.</cyan></b>`);
    }

    const effect = state.EffectFactory.create('blind', { duration }, { spellStrength: getAmount });
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_blind');
  },

  info: (player) => 'Вы ослепляете противника, понижая его способность видеть спрятавшихся и невидимых существ. Длительность эффекта зависит от вашего интеллекта и ловкости. Величина эффекта зависит от вашего урона хаосом, сопротивляемости урону хаоса цели, вашего интеллекта и степени владения заклинанием.',
};
