'use strict';

const { Logger } = require('ranvier');

module.exports = {
  listeners: {
    spawn: state => function () {
      const leader = this.getBehavior('leader');
      const followers = leader.followers;
      for (const follower of followers) {
        const spawnedFollower = this.room.spawnNpc(state, follower);
//        Logger.verbose(`Leader [${this.name}] spawn ${spawnedFollower.name}.`);
        spawnedFollower.follow(this);
      }
//      Logger.verbose(`Leader followers: ${this.followers.size}` );
    }
  }
};
