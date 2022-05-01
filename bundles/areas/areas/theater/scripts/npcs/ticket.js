module.exports = {
  listeners: {
    take: (state) => function (player, item) {
      state.ChannelManager.get('say').send(state, this, 'Проходите, не задерживайтесь.');

      let nextRoom = null;
      const look = state.CommandManager.get('look');
      nextRoom = state.RoomManager.getRoom('theater:47702');
      player.moveTo(nextRoom);
      look.execute(null, player, null);
    },
  },
};
