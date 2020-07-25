const { Broadcast: B, SkillType } = require('ranvier');

const manaCost = 100;

/**
 * Заклинание снятия дебаффа после смерти
 */
module.exports = {
  aliases: ['бодрость'],
  name: 'бодрость',
  gender: 'female',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: false,
  targetSelf: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 60,

  run: (state) => function (args, player, target) {
    if (!player.hasEffectType('death_debuff')) {
      return B.sayAt(player, 'Вы сейчас не чувствуюте уныния.');
    }

    const deathEffect = target.effects.getByType('death_debuff');
    let ending = '';
    if (player.gender === 'male') {
      ending = '';
    } else if (player.gender === 'female') {
      ending = 'а';
    } else if (player.gender === 'plural') {
      ending = 'и';
    } else {
      ending = 'о';
    }

    if (target !== player) {
      B.sayAt(player, `<b>Вы шепчете в ухо ${target.rname} слова одобрения, теперь он${ending} более счастлив${ending}.</b>`);
      B.sayAtExcept(player.room, `<b>${player.Name} шепчет в ухо ${target.rname} слова одобрения, теперь он${ending} более счастлив${ending}.</b>`, [target, player]);
      B.sayAt(target, `<b>${player.Name} шепчет вам ухо слова одобрения, вы чувствуете себя счастливее.</b>`);
    } else {
      B.sayAt(player, '<b>Вы собираете волю в кулак, теперь вы чувствуюте себя счастливее.</b>');
      B.sayAtExcept(player.room, `<b>${player.Name} собирает волю в кулак, теперь он${ending} чувствует себя счастливее.</b>`, player);
    }

    deathEffect.remove();
  },

  info: (player) => 'Снимает с цели заклинания дебафф от смерти.',
};
