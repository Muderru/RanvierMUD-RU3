const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    channelReceive: (state) => function (say, player, message) {
      if (message === 'по делу') {
        state.ChannelManager.get('say').send(state, this, 'Да, эта стерва не пропустит к директору. Я тут уже несколько часов жду!');
        const secret = Array.from(this.room.npcs).find((npc) => npc.entityReference === 'theater:47720');
        this.initiateCombat(secret);
      }
    },
  },
};
