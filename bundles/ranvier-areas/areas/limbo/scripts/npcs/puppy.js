
'use strict';

module.exports = (srcPath) => {
  const Broadcast = require(srcPath + 'Broadcast');

  return  {
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
};
