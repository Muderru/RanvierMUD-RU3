'use strict';

const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'зоны',
  aliases: [ 'зоны', 'локации' ],
  command: (state) => (args, p) => {
    B.sayAt(p, B.center(90, '<b><green>Перечень локаций</green></b>'));
    B.sayAt(p, B.line(70, '=', 'green'));
    B.sayAt(p, sprintf('%-40s %33s', '  <b>Зона (рек. уровни)</b>', '<b>Автор(ы)</b>'));

    for (const [key, area] of state.AreaManager.areas) {
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
        B.sayAt(p, sprintf('%-40s %16s', '  ' + area.title + ' (' + area.metadata.minlevel + ' - ' + area.metadata.maxlevel +')', 
                                area.metadata.author));
      }
    }

    B.sayAt(p, B.line(70, '=', 'green'));
    B.sayAt(p, '');
  }
};
