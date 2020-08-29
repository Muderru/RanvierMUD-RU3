const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 25;
const manaCost = 150;
const debuffMod = 0.25; // debuff strength coefficient

/**
 * Проклятие защиты
 */
module.exports = {
  aliases: ['проклятие защиты'],
  name: 'проклятие защиты',
  gender: 'neuter',
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
    if (!target.hasAttribute('armor')) {
      return B.sayAt(player, `<b>На ${target.vname} это заклинание не подействует.</b>`);
    }

    const getAmount = Math.floor(SkillUtil.directSpellDamage(player, target, 'chaos', 'defense_curse') * debuffMod);
    const duration = SkillUtil.effectDuration(player);

    B.sayAt(player, `<b><red>Вы чертите в воздухе пентаграмму, броня ${target.rname} начинает истончаться.</red></b>`);
    B.sayAtExcept(player.room, `<b><red>${player.Name} чертит в воздухе пентаграмму, броня ${target.rname} начинает истончаться.</red></b>`, [target, player]);
    if (!target.isNpc) {
      B.sayAt(target, `<b><red>${player.Name} чертите в воздухе пентаграмму, ваша броня начинает истончаться.</red></b>`);
    }

    const effect = state.EffectFactory.create('defense_curse', { duration }, { spellStrength: getAmount });
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_defense_curse');
  },

  info: (player) => 'Вы проклинаете противника и заставляете его броню истончиться. Длительность эффекта зависит от вашего интеллекта и ловкости. Величина эффекта зависит от вашего урона хаосом, сопротивляемости урону хаоса цели, вашего интеллекта и степени владения заклинанием.',
};
