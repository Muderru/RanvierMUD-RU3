const { sprintf } = require('sprintf-js');
const { Broadcast } = require('ranvier');

function sayAtColumns(source, strings, numCols) {
  // Build a 2D map of strings by col/row
  let col = 0;
  const perCol = Math.ceil(strings.length / numCols);
  let rowCount = 0;
  const colWidth = Math.floor((3 * 20) / numCols);
  const columnedStrings = strings.reduce((map, string, index) => {
    if (rowCount >= perCol) {
      rowCount = 0;
      col++;
    }
    map[col] = map[col] || [];

    if (!map[col]) {
      map.push([]);
    }

    map[col].push(string);
    rowCount++;
    return map;
  }, []);

  col = 0;
  let row = 0;
  const said = [];
  while (said.length < strings.length) {
    if (columnedStrings[col] && columnedStrings[col][row]) {
      const string = columnedStrings[col][row];
      said.push(string);
      Broadcast.at(source, sprintf(`%-${colWidth}s`, string));
    }

    col++;
    if (col === numCols) {
      Broadcast.sayAt(source);
      col = 0;
      row++;
    }
  }

  // append another line if need be
  if ((col) % numCols !== 0) {
    Broadcast.sayAt(source);
  }
}

module.exports = {
  aliases: ['каналы', 'команды'],
  command: (state) => (args, player) => {
    // print standard commands
    Broadcast.sayAt(player, '<bold><white>                  Команды</bold></white>');
    Broadcast.sayAt(player, '<bold><white>===============================================</bold></white>');

    const commands = [];
    for (const [name, command] of state.CommandManager.commands) {
      if (player.role >= command.requiredRole) {
        commands.push(name);
      }
    }

    commands.sort();
    sayAtColumns(player, commands, 4);

    // channels
    Broadcast.sayAt(player);
    Broadcast.sayAt(player, '<bold><white>                  Каналы</bold></white>');
    Broadcast.sayAt(player, '<bold><white>===============================================</bold></white>');

    const channelCommands = [];
    for (const [name] of state.ChannelManager.channels) {
      channelCommands.push(name);
    }

    channelCommands.sort();
    sayAtColumns(player, channelCommands, 4);

    // end with a line break
    Broadcast.sayAt(player, '');
  },
};
