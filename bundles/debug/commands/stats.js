const { Broadcast: B, PlayerRoles } = require('ranvier');

/**
 * Выводит некоторую статистику по миру
 */
module.exports = {
  requiredRole: PlayerRoles.ADMIN,
  usage: 'hotfix <command name>',
  aliases: ['статистика'],
  command: state => (commandName, player) => {
    let allAreas = 0;
    let allRooms = 0;
    let allMobs = 0;

    for (const [, area] of state.AreaManager.areas) {
      if (!area.metadata.hidden) {
        allAreas += 1;
        allRooms += area.rooms.size;
        allMobs += area.npcs.size;
      }
    }

    B.sayAt(player, `Зон: ${allAreas}`);
    B.sayAt(player, `Комнат: ${allRooms}`);
    B.sayAt(player, `Мобов (всего, не прототипов): ${allMobs}`);
  }
};
