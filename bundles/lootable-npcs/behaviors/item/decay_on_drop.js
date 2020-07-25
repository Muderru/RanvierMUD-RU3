const { Broadcast, Logger } = require('ranvier');

module.exports = {
  listeners: {
    drop: (state) => function (item) {
      const { room } = this;

      if (room) {
        if (this.gender === 'male') {
          Broadcast.sayAt(room, `${this.Name} рассыпался в прах!`);
        } else if (this.gender === 'female') {
          Broadcast.sayAt(room, `${this.Name} рассыпалась в прах!`);
        } else if (this.gender === 'plural') {
          Broadcast.sayAt(room, `${this.Name} рассыпались в прах!`);
        } else {
          Broadcast.sayAt(room, `${this.Name} рассыпалось в прах!`);
        }
      }

      Logger.verbose(`${this.id} has decayed on drop.`);
      state.ItemManager.remove(this);
    },
  },
};
