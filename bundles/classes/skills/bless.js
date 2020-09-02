const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 25;
const manaCost = 160;
const buffMod = 0.55; // buff strength coefficient

/**
 * Заклинание уменьшающее урон противника
 */
module.exports = {
  aliases: ['благословение'],
  name: 'благословение',
  gender: 'neuter',
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
    if (!target.hasAttribute('health')) {
      return B.sayAt(player, `<b>На ${target.vname} это заклинание не подействует.</b>`);
    }

    const getAmount = Math.floor(SkillUtil.directSpellDamage(player, target, 'ether', 'bless') * buffMod);
    const duration = SkillUtil.effectDuration(player);

    let ending = '';
    if (target.gender === 'male') {
      ending = 'ём';
    } else if (target.gender === 'female') {
      ending = 'ей';
    } else if (target.gender === 'plural') {
      ending = 'их';
    } else {
      ending = 'ём';
    }

    B.sayAt(player, `<b><yellow>Вы благославляете ${target.vname} и в н${ending} разгорается духовное пламя.</yellow></b>`);
    B.sayAtExcept(player.room, `<b><yellow>${player.Name} благославляет ${target.vname} и в н${ending} разгорается духовное пламя.</yellow></b>`, [target, player]);
    if (!target.isNpc) {
      B.sayAt(target, `<b><yellow>${player.Name} благославляете вас. В вас разгорается духовное пламя!</yellow></b>`);
    }

    const effect = state.EffectFactory.create('bless', { duration }, { spellStrength: getAmount });
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_bless');
  },

  info: (player) => 'Вы благословляете цель и она начинает наносить увеличенный урон. Длительность эффекта зависит от вашего интеллекта и ловкости. Величина эффекта зависит от вашего урона эфиром, сопротивляемости урону эфиром цели, вашего интеллекта и степени владения заклинанием.',
};
