'use strict';

const { Broadcast, Logger, Data } = require('ranvier');

/**
 * Отчитывает время работы сервера в минутах и сохраняет его в файл gameTime.json
 * Один игровой час длится 4,4 мин для равномерного распределения событий в игре и 
 * для не слишком частого обращения к диску.
 */
module.exports = {
  listeners: {
    startup: state => function () {
      let tmpGameTime = 0;
      setInterval(() => {
        tmpGameTime = Data.parseFile('gameTime.json').ingameTime;
        tmpGameTime++;
        Data.saveFile('gameTime.json', { ingameTime: tmpGameTime });

        const dayDuration = 24;
        
        if (tmpGameTime >= dayDuration) {
          tmpGameTime = tmpGameTime % dayDuration;
        }

        for (const [key, area] of state.AreaManager.areas) {
          area.time = tmpGameTime;
//          Logger.verbose(`Area ${area.name} set time ${area.time}`)
        }
      }, 264000);
    },

  },
};
