'use strict';

const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: state => function (player) {
      if (this.following) {
        return;
      }

      Broadcast.sayAt(player, 'Щенок заливается счастливым лаем и подбегает к вам.');
      this.follow(player);
    }
  }
};
