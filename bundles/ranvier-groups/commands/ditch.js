'use strict';

module.exports = srcPath => {
  const Broadcast = require(srcPath + 'Broadcast');
  const CommandParser = require(srcPath + 'CommandParser').CommandParser;

  return {
    aliases: [ 'прогнать', 'выгнать' ],
    command: state => (arg, player) => {
      if (!arg || !arg.length) {
        return Broadcast.sayAt(player, 'Кого вы хотите прогнать?');
      }

      let target = CommandParser.parseDot(arg, player.followers);

      if (!target) {
        return Broadcast.sayAt(player, "Он не следует за вами.");
      }

      if (target.gender === 'male') {
        Broadcast.sayAt(player, `Вы прогнали ${target.vname} и он перестал следовать за вами.`);
      } else if (target.gender === 'female') {
        Broadcast.sayAt(player, `Вы прогнали ${target.vname} и она перестала следовать за вами.`);
      } else if (target.gender === 'plural') {
        Broadcast.sayAt(player, `Вы прогнали ${target.vname} и они перестали следовать за вами.`);
      } else {
        Broadcast.sayAt(player, `Вы прогнали ${target.vname} и оно перестало следовать за вами.`);
      }

      if (player.gender === 'male') {
        Broadcast.sayAt(target, `${player.name} прогнал вас и вы перестали следовать за ним.`);
      } else if (player.gender === 'female') {
        Broadcast.sayAt(target, `${player.name} прогнала вас и вы перестали следовать за ней.`);
      } else if (player.gender === 'plural') {
        Broadcast.sayAt(target, `${player.name} прогнали вас и вы перестали следовать за ними.`);
      } else {
        Broadcast.sayAt(target, `${player.name} прогнало вас и вы перестали следовать за ним.`);
      }      

      target.unfollow();
    }
  };
};
