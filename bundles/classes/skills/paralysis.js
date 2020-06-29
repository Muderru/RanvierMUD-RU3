'use strict';

const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 185;

/**
 * Паралич
 */
module.exports = {
  aliases: ['паралич'],
  name: 'паралич',
  gender: 'male',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  targetSelf: false,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 90,

  run: state => function (args, player, target) {
    if (!target.hasAttribute('freedom')) {
      return B.sayAt(player, `<b>На ${target.vname} это заклинание не подействует.</b>`);
    }

    let duration = SkillUtil.effectDuration(player);

    B.sayAt(player, `<b><magenta>Вы пристально смотрите в глаза ${target.rname}, приказывая замереть.</magenta></b>`);
    B.sayAtExcept(player.room, `<b><magenta>${player.Name} пристально смотрит в глаза ${target.rname}, приказывая замереть.</magenta></b>`, [target, player]);
    if (!target.isNpc) {
      B.sayAt(target, `<b><magenta>${player.Name} пристально смотрит в ваши глаза, приказывая замереть.</magenta></b>`);
    }

    const effect = state.EffectFactory.create('paralysis', {duration}, {spellStrength: SkillUtil.getBuff(player, 'spell_paralysis')});
    target.addEffect(effect);

    SkillUtil.skillUp(state, player, 'spell_invisibility');
  },

  info: (player) => {
    return `Тело противника деревенеет и теряет способность к движению. Длительность эффекта зависит от вашего интеллекта и ловкости.`;
  }
};
