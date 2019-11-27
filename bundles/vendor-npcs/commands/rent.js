'use strict';

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B, CommandManager } = require('ranvier');
const say = B.sayAt;

const subcommands = new CommandManager();
subcommands.add({
  name: 'yes',
  aliases: [ 'да', 'здесь' ],
  command: state => (innkeeper, args, player) => {
    const innkeeperConfig = innkeeper.getMeta('innkeeper');
    const tell = genTell(state, innkeeper, player);

    const currentHome = player.getMeta('home');
    if (innkeeper.room.entityReference === currentHome) {
      return tell("Вы уже снимаете у меня комнату.");
    }

    const gold = 'currencies.' + 'золото';
    const money = player.getMeta(gold);
    if (money < innkeeperConfig.cost) {
      return tell("Вы не можете себе это позволить.");
    }

    player.setMeta('home', innkeeper.room.entityReference);
    B.sayAt(player, `${innkeeper.room.title} - теперь ваш дом.`);
    player.setMeta(gold, money - innkeeperConfig.cost);
    player.save();

  }
});

module.exports = {
  aliases: [ 'постой' ],
  usage: 'постой',
  command: state => (args, player, arg0) => {
    // if list/buy aliases were used then prepend that to the args
    args = (!['постой', 'рента'].includes(arg0) ? arg0 + ' ' : '') + args;

    const innkeeper = Array.from(player.room.npcs).find(npc => npc.getMeta('innkeeper'));

    if (!innkeeper) {
      return B.sayAt(player, "Здесь нельзя снять жилье.");
    }

    const [ command, ...commandArgs ] = args.split(' ');
    const subcommand = subcommands.find(command);

    const innkeeperConfig = innkeeper.getMeta('innkeeper');
    const cost = innkeeperConfig.cost;
    const tell = genTell(state, innkeeper, player);

    if (!args) {
      return tell('Вы можете снять здесь комнату за ' + cost +' золотых.');
    }

    subcommand.command(state)(innkeeper, commandArgs.join(' '), player);
  }
};

function genTell(state, innkeeper, player) {
  return message => {
    state.ChannelManager.get('tell').send(state, innkeeper, player.name + ' ' + message);
  };
}
