module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      let nextRoom = null;
      let rand = 0;
      rand = Math.floor((Math.random() * 3) + 1);

      switch (rand) {
        case 1:
          nextRoom = state.RoomManager.getRoom('2.4.5:maze_maze1');
          player.moveTo(nextRoom);
          break;
        case 2:
          nextRoom = state.RoomManager.getRoom('2.4.5:maze_maze2');
          player.moveTo(nextRoom);
          break;
        default:
      }
    },
  },
};
