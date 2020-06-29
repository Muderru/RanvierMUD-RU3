'use strict';

const { Broadcast, SkillType, Config } = require('ranvier');
const say = Broadcast.sayAt;

const manaCost = 10;

/**
 * Бесплатный реколл
 */
module.exports = {
  aliases: [ 'вернуться' ],
  name: 'вернуться',
  type: SkillType.SKILL,
  requiresTarget: false,
  initiatesCombat: false,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 3600,

  run: state => (args, player, target) => {
    if (player.isInCombat()) {
      return say(player, "Сейчас вы сражаетесь и не можете вернуться домой.");
    }

    const startingRoomRef = Config.get('startingRoom');
    if (!startingRoomRef) {
      Logger.error('No startingRoom defined in ranvier.json');
    }

    let home = state.RoomManager.getRoom(player.getMeta('home'));
    if (!home) {
      home = state.RoomManager.getRoom(startingRoomRef);
    }

    say(player, `<b><cyan>Вы молитесь богам о скором возвращении домой. Боги снисходят до вас и переносят домой.</cyan></b>`);
    Broadcast.sayAtExcept(player.room, `<b><cyan>Божественной силой ${player.Name} переносится домой.</cyan></b>`, player);

    player.moveTo(home);
    state.CommandManager.get('look').execute(null, player);
    player.save();
  },

  info: (player) => {
      return `Раз в час вы можете вернуться домой (начальную комнату или комнату ренты).`;
  }
};
