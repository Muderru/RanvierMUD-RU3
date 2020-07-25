const { Broadcast: B, SkillType } = require('ranvier');
const SkillUtil = require('../lib/SkillUtil');

const manaCost = 265;

/**
 * Призвать мелкого беса
 */
module.exports = {
  aliases: ['мелкий бес'],
  name: 'мелкий бес',
  gender: 'female',
  type: SkillType.SPELL,
  requiresTarget: false,
  initiatesCombat: false,
  targetSelf: false,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 180,

  run: (state) => function (args, player) {
    for (const follower of player.followers) {
      if (follower.id === 'petty_demon') {
        return B.sayAt(player, 'Он уже следует за вами!');
      }
    }

    B.sayAt(player, '<b>Вы чертите на земле кровавую пентаграмму в центре которой появляется мелкий бес.</b>');
    B.sayAtExcept(player.room, `<b>${player.Name} чертит на земле кровавую пентаграмму в центре которой появляется мелкий бес.</b>`, player);

    let minion = player.room.spawnNpc(state, 'pets:petty_demon');
    minion = SkillUtil.minionBuff(player, minion, 'spell_petty_demon');
    minion.follow(player);

    SkillUtil.skillUp(state, player, 'spell_petty_demon');
  },

  info: (player) => 'Призовите себе помощника из самих глубин ада.',
};
