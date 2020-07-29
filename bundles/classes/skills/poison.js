const { Broadcast, SkillType, Damage } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const cooldown = 30;
const cost = 120;
const tickInterval = 2;
const ddMod = 0.4; // direct damage coefficient
const dotMod = 0.3; // damage over time coefficient

/**
 * DoT (Damage over time) skill
 */
module.exports = {
  aliases: ['яд'],
  name: 'яд',
  gender: 'male',
  damageVerb: 'отравляет',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost,
  },
  cooldown,

  run: (state) => function (args, player, target) {
    const getDamage = Math.floor(SkillUtil.directSpellDamage(player, target, 'acid', 'poison') * ddMod);

    const damage = new Damage('health', getDamage, player, this);

    const duration = SkillUtil.dotDuration(player, target);

    const effect = state.EffectFactory.create(
      'poison',
      {
        duration,
        description: this.info(player),
        tickInterval,
      },
      {
        totalDamage: Math.floor(SkillUtil.dotSpellDamage(player, target, 'acid', 'poison') * dotMod),
      },
    );
    effect.skill = this;
    effect.attacker = player;

    effect.on('effectDeactivated', () => {
      if (target.gender === 'male') {
        Broadcast.sayAt(player, `<green><b>${target.Name}</b> больше не отравлен.</green>`);
      } else if (target.gender === 'female') {
        Broadcast.sayAt(player, `<green><b>${target.Name}</b> больше не отравлена.</green>`);
      } else if (target.gender === 'plural') {
        Broadcast.sayAt(player, `<green><b>${target.Name}</b> больше не отравлены.</green>`);
      } else {
        Broadcast.sayAt(player, `<green><b>${target.Name}</b> больше не отравлено.</green>`);
      }
    });

    Broadcast.sayAt(player, `<green>Метким плевком вы отравили <bold>${target.vname}</bold>!</green>`);
    if (player.gender === 'male') {
      Broadcast.sayAtExcept(player.room, `<green>${player.Name} метким плевком отравил ${target.vname}.</green>`, [target, player]);
      Broadcast.sayAt(target, `<green>${player.Name} метким плевком отравил вас!</green>`);
    } else if (player.gender === 'female') {
      Broadcast.sayAtExcept(player.room, `<green>${player.Name} метким плевком отравила ${target.vname}.</green>`, [target, player]);
      Broadcast.sayAt(target, `<green>${player.Name} метким плевком отравила вас!</green>`);
    } else if (player.gender === 'plural') {
      Broadcast.sayAtExcept(player.room, `<green>${player.Name} метким плевком отравили ${target.vname}.</green>`, [target, player]);
      Broadcast.sayAt(target, `<green>${player.Name} метким плевком отравили вас!</green>`);
    } else {
      Broadcast.sayAtExcept(player.room, `<green>${player.Name} метким плевком отравило ${target.vname}.</green>`, [target, player]);
      Broadcast.sayAt(target, `<green>${player.Name} метким плевком отравило вас!</green>`);
    }

    damage.commit(target);
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_poison');
  },

  info: (player) => 'Отравляет цель. Наносит урон зависящий от урона вашего оружия, интеллекта, вашего бонусного кислотного урона, уровня владения умением и сопротивляемости кислоте цели. Длительность отравления зависит от ловкости атакующего.',
};
