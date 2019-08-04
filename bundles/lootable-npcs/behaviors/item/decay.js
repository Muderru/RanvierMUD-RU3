'use strict';

const { Broadcast, Logger } = require('ranvier');

module.exports = {
  listeners: {
    updateTick: state => function (config) {
      const now = Date.now();
      let { duration = 60 } = config;
      duration = duration * 1000;
      this.decaysAt = this.decaysAt || now + duration;

      if (now >= this.decaysAt) {
        this.emit('decay');
      } else {
        this.timeUntilDecay = this.decaysAt - now;
      }
    },

    decay: state => function (item) {
      const { room, belongsTo } = this;

      if (belongsTo) {
        const owner = this.findOwner();
        if (owner) {
            if (this.gender === 'male') {
              Broadcast.sayAt(owner, `Ваш ${this.name} рассыпался в прах!`);
            } else if (this.gender === 'female') {
              Broadcast.sayAt(owner, `Ваша ${this.name} рассыпалась в прах!`);
            } else if (this.gender === 'plural') {
              Broadcast.sayAt(owner, `Ваши ${this.name} рассыпались в прах!`);
            } else {
              Broadcast.sayAt(owner, `Ваше ${this.name} рассыпалось в прах!`);
          }
        }
      }

      if (room) {
          if (this.gender === 'male') {
            Broadcast.sayAt(room, `${this.name} рассыпался в прах!`);
          } else if (this.gender === 'female') {
            Broadcast.sayAt(room, `${this.name} рассыпалась в прах!`);
          } else if (this.gender === 'plural') {
            Broadcast.sayAt(room, `${this.name} рассыпались в прах!`);
          } else {
            Broadcast.sayAt(room, `${this.name} рассыпалось в прах!`);
        }
        
      }

      Logger.verbose(`${this.id} has decayed.`);
      state.ItemManager.remove(this);
    }
  }
};
