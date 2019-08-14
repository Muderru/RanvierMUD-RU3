'use strict';

const { Broadcast } = require('ranvier');

/**
 * Flush the command queue
 */
module.exports = {
  usage: 'очистить',
  aliases: ['очистить', 'стоп'],
  command : (state) => (args, player) => {
    player.commandQueue.flush();
    Broadcast.sayAt(player, '<bold><yellow>Последовательность команд очищена.</yellow></bold>');
  }
};
