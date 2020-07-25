const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 180;

/**
 * Молчание
 */
module.exports = {
  aliases: ['молчание'],
  name: 'молчание',
  gender: 'neuter',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: true,
  targetSelf: false,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 60,

  run: (state) => function (args, player, target) {
    const duration = SkillUtil.effectDuration(player);

    SkillUtil.skillUp(state, player, 'spell_silence');
    if (!player.isNpc) {
      const chance = Math.floor(Math.random() * 101);
      if (chance >= (50 + (SkillUtil.getBuff(player, 'spell_silence') / 2))) {
        return B.sayAt(player, `Вам не удалось замолчать ${target.vname}.`);
      }
    }

    B.sayAt(player, `<b>Вы сжимаете руки в кулаки, заставляя ${target.vname} замолчать.</b>`);
    B.sayAtExcept(player.room, `<b>${player.Name} сжимает руки в кулаки, заставляя ${target.vname} замолчать.</b>`, [target, player]);
    B.sayAt(target, `<b>${player.Name} сжимает руки в кулаки, заставляя вас замолчать.</b>`);

    const effect = state.EffectFactory.create('silence', { duration });
    target.addEffect(effect);
  },

  info: (player) => 'Делает противника немым, как рыба. Шанс срабатывания зависит от раскачки умения.',
};
