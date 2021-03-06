const { Broadcast, Damage, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 15;
const manaCost = 80;
const ddMod = 1.2; // direct damage coefficient
const dbMod = 0.1; // debaff coefficient

/**
 * Basic mage spell
 */
module.exports = {
  aliases: ['кислота'],
  name: 'кислота',
  gender: 'female',
  damageVerb: 'разъедает',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown,

  run: (state) => function (args, player, target) {
    const getDamage = Math.floor(SkillUtil.directSpellDamage(player, target, 'acid', 'acid') * ddMod);

    const damage = new Damage('health', getDamage, player, this);

    const duration = SkillUtil.effectDuration(player);

    if (target.hasAttribute('armor')) {
      const effect = state.EffectFactory.create('acid', { duration }, { spellStrength: Math.floor(getDamage * dbMod) });
      target.addEffect(effect);
    }

    Broadcast.sayAt(player, `<bold><green>Вы извергаете поток кислоты в ${target.vname}!</green></bold>`);
    Broadcast.sayAtExcept(player.room, `<bold><green>${player.Name} извергает поток кислоты в ${target.vname}!</green></bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold><green>${player.Name} извергает поток кислоты в ВАС!</green></bold>`);
    }
    damage.commit(target);

    SkillUtil.skillUp(state, player, 'spell_acid');
  },

  info: (player) => 'Создает поток кислоты, наносящую урон зависящий от урона вашего оружия, интеллекта, вашего бонусного урона кислотой, уровня владения умением и сопротивляемости кислоте цели. Уменьшает броню противника.',
};
