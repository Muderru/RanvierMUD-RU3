const { Broadcast, Logger } = require('ranvier');

module.exports = {
  listeners: {
    get: (state) => function (config, player) {
      let money = 0;
      const getMoney = this.getBehavior('money');
      const minMoney = getMoney.min;
      const maxMoney = getMoney.max;

      money = Math.floor(Math.random() * (maxMoney - minMoney)) + minMoney;
      if (money < 1) {
        money = 10;
      }

      const playerGold = player.getMeta('currencies.золото');
      player.setMeta('currencies.золото', playerGold + money);
      Broadcast.sayAt(player, `Вы получили ${money} золота.`);

      Logger.verbose(`${player.name} has receive ${money} gold.`);
      state.ItemManager.remove(this);
    },
  },
};
