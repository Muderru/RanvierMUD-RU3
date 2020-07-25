const { Broadcast, Damage, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 80;
const ddMod = 0.7; // direct damage coefficient
const dbMod = 0.1; // debaff coefficient

/**
 * Bash
 */
module.exports = {
  aliases: ['сбить', 'сбивание'],
  name: 'сбивание с ног',
  gender: 'neuter',
  damageVerb: 'травмировало',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 20,

  run: (state) => function (args, player, target) {
    if (!player.isNpc) {
      if (!player.equipment.has('щит')) {
        return Broadcast.sayAt(player, 'У вас нет щита.');
      }
    }

    const getDamage = Math.floor(SkillUtil.directSkillDamage(player, target, 'crushing', 'bash') * ddMod);

    const damage = new Damage('health', getDamage, player, this);

    const duration = SkillUtil.effectDuration(player);

    const effect = state.EffectFactory.create('bash', { duration }, { spellStrength: Math.floor(getDamage * dbMod) });
    target.addEffect(effect);

    Broadcast.sayAt(player, `<bold><red>Вы нанесли сильный удар ${target.dname}, сбивая с ног!</red></bold>`);
    Broadcast.sayAtExcept(player.room, `<bold><red>${player.Name} наносит сильный удар ${target.dname}, сбивая с ног!</red></bold>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<bold><red>${player.Name} наносит вам сильный удар, сбивая с ног!</red></bold>`);
    }
    damage.commit(target);

    SkillUtil.skillUp(state, player, 'skill_bash');
  },

  info: (player) => 'Наносит сильный удар противнику и сбивает его с ног. Наносит урон зависящий от урона вашего оружия, силы, вашего дополнительного дробящего урона, уровня владения умением и сопротивляемости дробящему урону цели. Может обездвижить противника. Необходим щит.',
};
