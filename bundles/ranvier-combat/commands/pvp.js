'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');
  const Player = require(srcPath + 'Player');
  const Parser = require(srcPath + 'CommandParser').CommandParser;

  return {
    aliases: ['пвп', 'пк'],
    command : (state) => (args, player) => {
      const previousPvpSetting = player.getMeta('pvp') || false;
      const newPvpSetting = !previousPvpSetting;
      player.setMeta('pvp', newPvpSetting);

      const message = newPvpSetting ?
        'Теперь вы можете дуэлиться с другими игроками.' :
        'Теперь вы пацифист и не можете дуэлиться с другими игроками.';
      Broadcast.sayAt(player, message);
    }
  };
};
