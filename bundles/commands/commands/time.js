const { Broadcast, Data } = require('ranvier');

module.exports = {
  usage: 'время',
  aliases: ['время'],
  command: (state) => (args, player) => {
    let tmpGameTime = Data.parseFile('gameTime.json').ingameTime;
    let year = 1; let month = 1; let day = 1;
    // день 24, месяц 24*30, год 24*30*12
    const yearDuration = 8640;
    const monthDuration = 720;
    const dayDuration = 24;

    if (tmpGameTime >= yearDuration) {
      while (tmpGameTime >= yearDuration) {
        tmpGameTime -= yearDuration;
        year++;
      }
    }

    if (tmpGameTime >= monthDuration) {
      while (tmpGameTime >= monthDuration) {
        tmpGameTime -= monthDuration;
        month++;
      }
    }

    if (tmpGameTime >= dayDuration) {
      while (tmpGameTime >= dayDuration) {
        tmpGameTime -= dayDuration;
        day++;
      }
    }

    const monthName = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    let ending = '';
    switch (tmpGameTime) {
      case 1:
        ending = '';
        break;
      case 2:
        ending = 'а';
        break;
      case 3:
        ending = 'а';
        break;
      case 4:
        ending = 'а';
        break;
      default:
        ending = 'ов';
    }

    Broadcast.sayAt(player, `Сейчас ${year} год от Сотворения, ${
      day} ${monthName[month - 1]}. ${tmpGameTime} час${ending}.`);
  },
};
