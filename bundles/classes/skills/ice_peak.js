const { Broadcast, Damage, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 85;
const ddMod = 0.9; // direct damage coefficient
const dbMod = 0.05; // debaff coefficient

/**
 * Basic mage spell
 */
module.exports = {
  aliases: ['ледяной снаряд'],
  name: 'ледяной снаряд',
  gender: 'male',
  damageVerb: 'заморозил',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 15,

  run: (state) => function (args, player, target) {
    const getDamage = Math.floor(SkillUtil.directSpellDamage(player, target, 'cold', 'ice_peak') * ddMod);

    const damage = new Damage('health', getDamage, player, this);

    const duration = SkillUtil.effectDuration(player);

    const effect = state.EffectFactory.create('ice_peak', { duration }, { spellStrength: Math.floor(getDamage * dbMod) });
    target.addEffect(effect);

    Broadcast.sayAt(player, `<bold><blue>Воздух между ваших рук замерз, принимая форму сосульки, которая поражает ${target.vname}!</blue></bold>`);
    Broadcast.sayAtExcept(player.room, `<bold><blue>Воздух между рук ${player.rname} замерз, принимая форму сосульки, которая поражает ${target.vname}!</blue></bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold><blue>Воздух между рук ${player.rname} замерз, принимая форму сосульки, которая поражает ВАС!</blue></bold>`);
    }
    damage.commit(target);

    SkillUtil.skillUp(state, player, 'spell_ice_peak');
  },

  info: (player) => 'Создает ледяную сосульку, наносящую урон зависящий от урона вашего оружия, интеллекта, вашего бонусного урона холодом, уровня владения умением и сопротивляемости холоду цели. Может заморозить противника.',
};
