const { Broadcast: B, PlayerRoles } = require('ranvier');

/**
 * Создает сражающихся ботов, для тестирования умений
 */
module.exports = {
  requiredRole: PlayerRoles.ADMIN,
  usage: 'hotfix <command name>',
  aliases: ['статистика'],
  command: state => (commandName, player) => {
    player.room.spawnNpc(state, 'pets:balance_bot1');
    player.room.spawnNpc(state, 'pets:balance_bot2');
  }
};
