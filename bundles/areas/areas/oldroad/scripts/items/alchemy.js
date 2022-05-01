const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'приготовить') {
        return;
      }

      if (args !== 'зелье') {
        return Broadcast.sayAt(player, 'Что вы хотите приготовить?');
      }

      const berry = player.hasItem('oldroad:66833');
      if (!berry) {
        return Broadcast.sayAt(player, 'У вас нет необходимого ингредиента.');
      }

      Broadcast.sayAt(player, 'Вы положили гоблинскую ягоду в ступку и начали интенсивно перетирать ее пестиком.');
      Broadcast.sayAt(player, 'Получилась вонючая жижа.');

      state.ItemManager.remove(berry);
      const targetItem = player.room.spawnItem(state, 'oldroad:66836');
      player.addItem(targetItem);
      player.room.removeItem(targetItem);
      state.ItemManager.remove(this);
    },
  },
};
