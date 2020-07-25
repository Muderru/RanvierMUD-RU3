const {
  Broadcast: B, SkillType, Config, Logger, Heal,
} = require('ranvier');

const manaCost = 100;

function getSkill(player) {
  let spellStrength = 1;
  if (player.getMeta('spell_recall') > 0) {
    spellStrength = player.getMeta('spell_recall');
  }
  return spellStrength;
}

/**
 * Свет
 */
module.exports = {
  aliases: ['возврат'],
  name: 'возврат',
  gender: 'male',
  type: SkillType.SPELL,
  requiresTarget: true,
  initiatesCombat: false,
  targetSelf: true,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 50,

  run: (state) => function (args, player, target) {
    if (target.isNpc) {
      return B.sayAt(player, 'Целью может быть только игрок.');
    }

    if (target !== player && !target.party) {
      return B.sayAt(player, 'Он не в вашей группе.');
    }

    const startingRoomRef = Config.get('startingRoom');
    if (!startingRoomRef) {
      Logger.error('No startingRoom defined in ranvier.json');
    }

    let home = state.RoomManager.getRoom(target.getMeta('home'));
    if (!home) {
      home = state.RoomManager.getRoom(startingRoomRef);
    }

    if (target !== player) {
      B.sayAt(player, `<b><red>В открытый вами портал засасывает ${target.vname}.</red></b>`);
      B.sayAtExcept(player.room, `<b><red>В открытый ${player.tname} портал засасывает ${target.vname}.</red></b>`, [target, player]);
      B.sayAt(target, `<b><red>Вас засасывает в открытый ${player.tname} портал.</red></b>`);
    } else {
      B.sayAt(player, '<b><red>Вы заходите в открытый вами портал.</red></b>');
      B.sayAtExcept(player.room, `<b><red>${player.Name} заходит в открытый им портал.</red></b>`, [player, target]);
    }

    target.moveTo(home);
    state.CommandManager.get('look').execute(null, target);
    target.save();

    const heal = new Heal('mana', getSkill(player), player, this, {
      hidden: true,
    });
    heal.commit(player);

    if (!player.isNpc) {
      const rnd = Math.floor((Math.random() * 100) + 1);
      if (rnd > 95) {
        if (player.getMeta('spell_recall') < 100) {
          const skillUp = player.getMeta('spell_recall');
          player.setMeta('spell_recall', skillUp + 1);
          B.sayAt(player, '<bold><cyan>Вы почувствовали себя увереннее в заклинании \'Возврат\'.</cyan></bold>');
        }
      }
    }
  },

  info: (player) => 'Отправьте себя или члена вашей группы домой. От владения заклинанием зависит количество потраченной на него маны.',
};
