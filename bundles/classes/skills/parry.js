const { Broadcast, SkillType, Damage } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 5;
const cost = 60;
const buffMod = 0.3; // buff strength
const ddMod = 0.9; // direct damage coefficient

/**
 * Damage mitigation skill
 */
module.exports = {
  aliases: ['парирование', 'парировать'],
  name: 'парирование',
  gender: 'neuter',
  damageVerb: 'ранило',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost,
  },
  cooldown,

  run: (state) => function (args, player, target) {
    if (!player.isNpc) {
      if (player.equipment.has('щит')) {
        return Broadcast.sayAt(player, 'Вы не можете парировать с щитом!');
      }
    }

    if (!player.isNpc) {
      if (!player.equipment.has('оружие')) {
        return Broadcast.sayAt(player, 'Вы не вооружены.');
      }
    }

    const getDamage = Math.floor(SkillUtil.directSkillDamage(player, target, 'cutting', 'parry') * ddMod);

    const damage = new Damage('health', getDamage, player, this);

    const duration = SkillUtil.effectDuration(player);

    const effect = state.EffectFactory.create(
      'skill.parry',
      {
        duration,
        description: this.info(player),
      },
      {
        magnitude: Math.ceil(SkillUtil.getBuff(player, 'skill_parry') * getDamage * buffMod),
      },
    );
    effect.skill = this;

    Broadcast.sayAt(player, `<bold>Вы парируете атаку ${target.rname}</bold>!`);
    Broadcast.sayAtExcept(player.room, `<bold>${player.Name} парирует атаку ${target.rname}!</bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `${player.Name} парирует вашу атаку!`);
    }
    player.addEffect(effect);
    damage.commit(target);

    SkillUtil.skillUp(state, player, 'skill_parry');
  },

  info: (player) => 'Парируйте атаку противника и получите снижающий урон щит. Длительность эффекта определяется вашей ловкостью. Нельзя парировать с щитом. Наносит небольшой урон, зависящий от вашего бонусного режущего урона.',
};
