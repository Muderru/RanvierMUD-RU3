'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'кто',
  aliases: [ 'кто' ],
  command: (state) => (args, player) => {
    B.sayAt(player, "<bold><red>                  Сейчас в игре</bold></red>");
    B.sayAt(player, "<bold><red>===============================================</bold></red>");
    B.sayAt(player, '');

    state.PlayerManager.players.forEach((otherPlayer) => {
      B.sayAt(player, ` *  ${otherPlayer.name} ${getRoleString(otherPlayer.role)}`);
    });

    B.sayAt(player, state.PlayerManager.players.size + ' всего');

    function getRoleString(role = 0) {
      return [
        '',
        '<white>[Билдер]</white>',
        '<b><white>[Администратор]</white></b>'
      ][role] || '';
    }
  }
};
