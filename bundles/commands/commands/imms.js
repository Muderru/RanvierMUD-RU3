'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'боги',
  aliases: [ 'боги' ],
  command: (state) => (args, player) => {
    B.sayAt(player, "<bold><red>                Администрация</bold></red>");
    B.sayAt(player, "<bold><red>===============================================</bold></red>");
    B.sayAt(player, '');

    B.sayAt(player, '   <bold>Туор</bold> - создатель всего этого безобразия');
    B.sayAt(player, '   <bold>e-mail</bold> pathfinderchemical@gmail.com');
    B.sayAt(player, '');
    B.sayAt(player, "<bold><red>===============================================</bold></red>");
    B.sayAt(player, '');

  }
};
