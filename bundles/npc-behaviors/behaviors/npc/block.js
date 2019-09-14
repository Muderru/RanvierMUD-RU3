'use strict';

const { Broadcast, Logger } = require('ranvier');

/**
 * Заглушка, чтобы игра не ругалась на отсутствие скрипта, также может
 * быть будет добавлено что-нибудь позже.
 */
module.exports = {
  listeners: {
    updateTick: state => function () {
//    Logger.verbose(`NPC [${this.uuid}] blocked exit.`);
    }
  }
};
