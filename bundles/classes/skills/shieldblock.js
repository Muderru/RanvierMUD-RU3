const { Broadcast, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 10;
const cost = 45;
const buffMod = 0.8; // buff strength

/**
 * Damage mitigation skill
 */
module.exports = {
  aliases: ['блокировать', 'блокирование'],
  name: 'блокирование',
  gender: 'neuter',
  type: SkillType.SKILL,
  requiresTarget: false,
  resource: {
    attribute: 'mana',
    cost,
  },
  cooldown,

  run: (state) => function (args, player, target) {
    if (!player.isNpc) {
      if (!player.equipment.has('щит')) {
        Broadcast.sayAt(player, 'Вы не держите щит!');
        return false;
      }
    }

    const duration = SkillUtil.effectDuration(player);

    const effect = state.EffectFactory.create(
      'skill.shieldblock',
      {
        duration,
        description: this.info(player),
      },
      {
        magnitude: Math.ceil(SkillUtil.getBuff(player, 'skill_shieldblock') * player.getAttribute('armor') * buffMod),
      },
    );
    effect.skill = this;

    Broadcast.sayAt(player, '<b>Вы подняли ваш щит, блокируя атаки врагов!</b>');
    if (player.gender === 'male') {
      Broadcast.sayAtExcept(player.room, `<b>${player.Name} поднял свой щит, блокируя атаки врагов.</b>`, [player]);
    } else if (player.gender === 'female') {
      Broadcast.sayAtExcept(player.room, `<b>${player.Name} подняла свой щит, блокируя атаки врагов.</b>`, [player]);
    } else if (player.gender === 'plural') {
      Broadcast.sayAtExcept(player.room, `<b>${player.Name} подняли свои щиты, блокируя атаки врагов.</b>`, [player]);
    } else {
      Broadcast.sayAtExcept(player.room, `<b>${player.Name} подняло свой щит, блокируя атаки врагов.</b>`, [player]);
    }
    player.addEffect(effect);

    SkillUtil.skillUp(state, player, 'skill_shieldblock');
  },

  info: (player) => 'Поднимите ваш щит и блокируйте урон, зависящий от вашего показателя брони. Длительность эффекта определяется вашей ловкостью. Требует щит.',
};
