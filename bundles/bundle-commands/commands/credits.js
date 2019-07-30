'use strict';

module.exports = {
  aliases: ['система', 'MUD'],
  command: state => (args, player) => {
    state.CommandManager.get('help').execute('credits', player);
  }
};
