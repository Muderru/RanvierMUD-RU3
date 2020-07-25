const { Broadcast, Damage, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 40;
const ddMod = 1; // direct damage coefficient

/**
 * Basic warrior attack
 */
module.exports = {
  aliases: ['выпад'],
  name: 'выпад',
  gender: 'male',
  damageVerb: 'ранит',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 5,

  run: (state) => function (args, player, target) {
    if (!player.isNpc) {
      if (!player.equipment.has('оружие')) {
        return Broadcast.sayAt(player, 'Вы не вооружены.');
      }
    }

    const getDamage = Math.floor(SkillUtil.directSkillDamage(player, target, 'piercing', 'lunge') * ddMod);

    const damage = new Damage('health', getDamage, player, this);

    Broadcast.sayAt(player, `<red>Вы делаете обманный маневр и пронзаете точным выпадом <bold>${target.vname}</bold>!</red>`);
    Broadcast.sayAtExcept(player.room, `<red>${player.Name} делает обманный маневр и пронзает ${target.vname} точным выпадом!</red>`, [player, target]);
    if (!target.isNpc) {
      Broadcast.sayAt(target, `<red>${player.Name} делает обманный маневр и пронзает вас точным выпадом!</red>`);
    }
    damage.commit(target);

    SkillUtil.skillUp(state, player, 'skill_lunge');
  },

  info: (player) => 'Выполняет точную атаку против вашего противника и наносит ему урон зависящий от урона вашего оружия, силы, вашего бонусного пронзающего урона, уровня владения умением и сопротивляемости пронзающему урону цели.',
};
