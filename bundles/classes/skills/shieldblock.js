'use strict';

const { Broadcast, SkillType } = require('ranvier');

// config placed here just for easy configuration of this skill later on
const cooldown = 60;
const cost = 75;

function getAttr2(player) {
  let addDamage = 0;
  if (player.hasAttribute('armor')) {
      addDamage += player.getAttribute('armor');
  }

  addDamage = 1+addDamage*0.5;
  return addDamage;
}

function getSkill(player) {
  let addDamage = 1;
  if (player.getMeta('skill_shieldblock') > 0) {
    addDamage = player.getMeta('skill_shieldblock');
  }
  return addDamage;
}


/**
 * Damage mitigation skill
 */
module.exports = {
  aliases: ['блокировать'],
  name: 'Блокирование щитом',
  gender: 'neither',
  damageVerb: 'защищает',
  type: SkillType.SKILL,
  requiresTarget: false,
  resource: {
    attribute: 'mana',
    cost,
  },
  cooldown,

  run: state => function (args, player, target) {
    if (!player.isNpc) {
      if (!player.equipment.has('щит')) {
        Broadcast.sayAt(player, "Вы не держите щит!");
        return false;
      }
    }

    let duration = 3000;
    if (player.hasAttribute('agility')) {
        duration = 1000*(1 + Math.floor(player.getAttribute('agility')/10));
    }

    const effect = state.EffectFactory.create(
      'skill.shieldblock',
      {
        duration,
        description: this.info(player),
      },
      {
        magnitude: Math.ceil(getAttr2(player) * getSkill(player))
      }
    );
    effect.skill = this;

    Broadcast.sayAt(player, `<b>Вы подняли ваш щит, блокируя атаки врагов!</b>`);
    if (player.gender === 'male') {
      Broadcast.sayAtExcept(player.room, `<b>${player.name} поднял свой щит, блокируя атаки врагов.</b>`, [player]);
    } else if (player.gender === 'female') {
      Broadcast.sayAtExcept(player.room, `<b>${player.name} подняла свой щит, блокируя атаки врагов.</b>`, [player]);
    } else if (player.gender === 'plural') {
      Broadcast.sayAtExcept(player.room, `<b>${player.name} подняли свои щиты, блокируя атаки врагов.</b>`, [player]);
    } else {
      Broadcast.sayAtExcept(player.room, `<b>${player.name} подняло свой щит, блокируя атаки врагов.</b>`, [player]);
    }
    player.addEffect(effect);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('skill_shieldblock') < 100) {
            let skillUp = player.getMeta('skill_shieldblock');
            player.setMeta('skill_shieldblock', skillUp + 1);
            Broadcast.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в умении \'Блокирование щитом\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Поднимите ваш щит и блокируйте урон, зависящий от вашего показателя брони. Длительность эффекта определяется вашей ловкостью. Требует щит.`;
  }
};
