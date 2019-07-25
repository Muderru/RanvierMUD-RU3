'use strict';

/**
 * Flush the command queue
 */
module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    usage: 'очистить',
    aliases: ['очистить', 'стоп'],
    command : (state) => (args, player) => {
      player.commandQueue.flush();
      Broadcast.sayAt(player, '<bold><yellow>Последовательность команд очищена.</yellow></bold>');
    }
  };
};
