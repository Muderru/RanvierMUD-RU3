const { Broadcast, SkillType, Damage } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 10;
const cost = 60;
const tickInterval = 2;
const ddMod = 0.8; // direct damage coefficient
const dotMod = 0.1; // damage over time coefficient

/**
 * DoT (Damage over time) skill
 */
module.exports = {
  aliases: ['порез'],
  name: 'порез',
  gender: 'male',
  damageVerb: 'ранит',
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
      if (!player.equipment.has('оружие')) {
        return Broadcast.sayAt(player, 'Вы не вооружены.');
      }
    }

    const getDamage = Math.floor(SkillUtil.directSkillDamage(player, target, 'cutting', 'rend') * ddMod);

    const damage = new Damage('health', getDamage, player, this);

    const duration = SkillUtil.dotDuration(player, target);

    const effect = state.EffectFactory.create(
      'skill.rend',
      {
        duration,
        description: this.info(player),
        tickInterval,
      },
      {
        totalDamage: Math.floor(SkillUtil.dotSkillDamage(player, target, 'cutting', 'rend') * dotMod),
      },
    );
    effect.skill = this;
    effect.attacker = player;

    effect.on('effectDeactivated', () => {
      if (target.gender === 'male') {
        Broadcast.sayAt(player, `<red><b>${target.Name}</b> перестал кровоточить.</red>`);
      } else if (target.gender === 'female') {
        Broadcast.sayAt(player, `<red><b>${target.Name}</b> перестала кровоточить.</red>`);
      } else if (target.gender === 'plural') {
        Broadcast.sayAt(player, `<red><b>${target.Name}</b> перестали кровоточить.</red>`);
      } else {
        Broadcast.sayAt(player, `<red><b>${target.Name}</b> перестало кровоточить.</red>`);
      }
    });

    Broadcast.sayAt(player, `<red>Подлой атакой вы нанесли рваную рану <bold>${target.dname}</bold>!</red>`);
    if (player.gender === 'male') {
      Broadcast.sayAtExcept(player.room, `<red>${player.Name} подлой атакой нанес рваную рану ${target.dname}.</red>`, [target, player]);
      Broadcast.sayAt(target, `<red>${player.Name} подлой атакой нанес вам рваную рану!</red>`);
    } else if (player.gender === 'female') {
      Broadcast.sayAtExcept(player.room, `<red>${player.Name} подлой атакой нанесла рваную рану ${target.dname}.</red>`, [target, player]);
      Broadcast.sayAt(target, `<red>${player.Name} подлой атакой нанесла вам рваную рану!</red>`);
    } else if (player.gender === 'plural') {
      Broadcast.sayAtExcept(player.room, `<red>${player.Name} подлой атакой нанесли рваную рану ${target.dname}.</red>`, [target, player]);
      Broadcast.sayAt(target, `<red>${player.Name} подлой атакой нанесли вам рваную рану!</red>`);
    } else {
      Broadcast.sayAtExcept(player.room, `<red>${player.Name} подлой атакой нанесло рваную рану ${target.dname}.</red>`, [target, player]);
      Broadcast.sayAt(target, `<red>${player.Name} подлой атакой нанесло вам рваную рану!</red>`);
    }

    damage.commit(target);
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'skill_rend');
  },

  info: (player) => 'Наносит цели рваную рану, наносящую урон зависящий от урона вашего оружия, силы, вашего бонусного режущего урона, уровня владения умением и сопротивляемости режущему урону цели. Длительность кровотечения зависит от ловкости атакующего.',
};
