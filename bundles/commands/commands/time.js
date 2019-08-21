'use strict';

const { Broadcast, Data } = require('ranvier');



module.exports = {
  usage: 'время',
  aliases: ['время'],
  command : (state) => (args, player) => {
      let tmpGameTime = Data.parseFile('gameTime.json').ingameTime;
      let year = 1, month = 1, day = 1, hour = 1;
      // день 60*24, месяц 60*24*30, год 60*24*30*12
      const yearDuration = 518400;
      const monthDuration = 43200;
      const dayDuration = 1440;
      
      if (tmpGameTime >= yearDuration) {
          while(tmpGameTime >= yearDuration) {
            tmpGameTime -= yearDuration;
            year++;
          }
      } else if (tmpGameTime >= monthDuration) {
          while(tmpGameTime >= monthDuration) {
            tmpGameTime -= monthDuration;
            month++;
          }
      } else if (tmpGameTime >= dayDuration) {
          while(tmpGameTime >= dayDuration) {
            tmpGameTime -= dayDuration;
            day++;
          }
      }
      
      let monthName = [ 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря' ];
      
      let ending = '';
      switch(tmpGameTime) {
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
      
      Broadcast.sayAt(player, 'Сейчас ' + year + ' год от Сотворения, ' + 
                     day +' ' + monthName[month-1] + '. ' + tmpGameTime + ' час' + ending + '.');
  }
};
