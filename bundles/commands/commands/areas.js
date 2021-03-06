const { sprintf } = require('sprintf-js');
const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'зоны',
  aliases: ['зоны', 'локации'],
  command: (state) => (args, p) => {
    B.sayAt(p, B.center(90, '<b><green>Перечень локаций</green></b>'));
    B.sayAt(p, B.line(70, '=', 'green'));
    B.sayAt(p, sprintf('%-50s %28s', '  <b>Зона (рек. уровни)</b>', '<b>Автор(ы)</b>'));

    for (const [, area] of state.AreaManager.areas) {
      if (!area.metadata.author) {
        area.metadata.author = 'Неизвестен';
      }
      if (!area.metadata.minlevel) {
        area.metadata.minlevel = 1;
      }
      if (!area.metadata.maxlevel) {
        area.metadata.maxlevel = 100;
      }
      if (!area.metadata.hidden) {
        if (p.room.area === area) {
          B.sayAt(p, sprintf('%-50s %31s', ` <green>*${area.title} (${area.metadata.minlevel} - ${area.metadata.maxlevel})</green>`,
            area.metadata.author));
        } else {
          B.sayAt(p, sprintf('%-50s %16s', `  ${area.title} (${area.metadata.minlevel} - ${area.metadata.maxlevel})`,
            area.metadata.author));
        }
      }
    }

    B.sayAt(p, B.line(70, '=', 'green'));
    B.sayAt(p, '');
  },
};
