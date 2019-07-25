'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return {
    usage: 'кто',
    aliases: [ 'кто' ],
    command: (state) => (args, player) => {
      Broadcast.sayAt(player, "<bold><red>                  Сейчас в игре</bold></red>");
      Broadcast.sayAt(player, "<bold><red>===============================================</bold></red>");
      Broadcast.sayAt(player, '');

      state.PlayerManager.players.forEach((otherPlayer) => {
        Broadcast.sayAt(player, ` *  ${otherPlayer.name} ${getRoleString(otherPlayer.role)}`);
      });

      Broadcast.sayAt(player, state.PlayerManager.players.size + ' всего');

      function getRoleString(role = 0) {
        return [
          '',
          '<white>[Билдер]</white>',
          '<b><white>[Администратор]</white></b>'
        ][role] || '';
      }
    }
  };
};
