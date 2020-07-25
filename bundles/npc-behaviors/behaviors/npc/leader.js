module.exports = {
  listeners: {
    spawn: (state) => function () {
      const leader = this.getBehavior('leader');
      const { followers } = leader;
      for (const follower of followers) {
        const spawnedFollower = this.room.spawnNpc(state, follower);
        spawnedFollower.follow(this);
      }
    },
  },
};
