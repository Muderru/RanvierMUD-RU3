'use strict';

const { Broadcast: B, SkillType } = require('ranvier');

const manaCost = 265;

function getSkill(player) {
  let spellStrength = 1;
  if (player.getMeta('spell_petty_demon') > 0) {
    spellStrength = player.getMeta('spell_petty_demon');
  }
  return spellStrength;
}

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

  run: state => function (args, player) {
    for (const follower of player.followers) {
      if (follower.id === 'petty_demon') {
        return B.sayAt(player, `Он уже следует за вами!`);
      }
    }

    B.sayAt(player, `<b>Вы чертите на земле кровавую пентаграмму в центре которой появляется мелкий бес.</b>`);
    B.sayAtExcept(player.room, `<b>${player.Name} чертит на земле кровавую пентаграмму в центре которой появляется мелкий бес.</b>`, player);

    const minion = player.room.spawnNpc(state, 'pets:petty_demon');
    minion.follow(player);

    if (!player.isNpc) {
      let rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
          if (player.getMeta('spell_petty_demon') < 100) {
            let skillUp = player.getMeta('spell_petty_demon');
            player.setMeta('spell_petty_demon', skillUp + 1);
            B.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Мелкий бес\'.</cyan></bold>');
          }
      }
    }
  },

  info: (player) => {
    return `Призовите себе помощника из самих глубин ада.`;
  }
};
