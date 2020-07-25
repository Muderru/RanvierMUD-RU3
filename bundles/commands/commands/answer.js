const { Broadcast } = require('ranvier');
const ArgParser = require('../../lib/lib/ArgParser');

const dot = ArgParser.parseDot;

module.exports = {
  usage: 'ответить',
  aliases: ['ответить'],
  command: (state) => (args, player) => {
    const lastInterlocutor = player.getMeta('interlocutor');
    if (!lastInterlocutor) {
      return Broadcast.sayAt(player, 'Вам некому ответить.');
    }

    if (!args || !args.length) {
      return Broadcast.sayAt(player, 'Что вы хотите ответить?');
    }

    const tell = state.ChannelManager.get('tell');
    const target = dot(lastInterlocutor, state.PlayerManager.players);
    if (!target) {
      return Broadcast.sayAt(player, 'Вашего собеседника нет в игре.');
    }

    tell.send(state, player, `${target.name} ${args}`);
  },
};
