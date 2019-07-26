'use strict';

const { Broadcast } = require('ranvier');
const ArgParser = require('../../bundle-example-lib/lib/ArgParser');

module.exports = {
  command: state => (arg, player) => {
    if (!arg || !arg.length) {
      return Broadcast.sayAt(player, 'Ditch whom?');
    }

    let target = ArgParser.parseDot(arg, player.followers);

    if (!target) {
      return Broadcast.sayAt(player, "They aren't following you.");
    }

    Broadcast.sayAt(player, `You ditch ${target.name} and they stop following you.`);
    Broadcast.sayAt(target, `${player.name} ditches you and you stop following them.`);
    target.unfollow();
  }
};
