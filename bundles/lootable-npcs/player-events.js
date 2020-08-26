const { Broadcast: B } = require('ranvier');
const EnhanceItem = require('../lib/lib/EnhanceItem');
const ItemUtil = require('../lib/lib/ItemUtil');

module.exports = {
  listeners: {
    currency: (state) => function (currency, amount) {
      const friendlyName = currency.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      const key = `currencies.${currency}`;

      if (!this.getMeta('currencies')) {
        this.setMeta('currencies', {});
      }
      this.setMeta(key, (this.getMeta(key) || 0) + amount);
      this.save();

      B.sayAt(this, `<b>Вы получили деньги: <yellow>[${friendlyName}] x${amount}.</yellow></b>`);
    },

    itemReward: (state) => function (item, quality) {
      let rewardItem = state.ItemFactory.create(state.AreaManager.getAreaByReference(item), item);
      rewardItem.hydrate(state);
      rewardItem.sourceRoom = this;
      state.ItemManager.add(rewardItem);

      if ( quality === 'uncommon' ) {
        rewardItem = EnhanceItem.enhance(rewardItem, 'uncommon');
      } else if ( quality === 'rare' ) {
        rewardItem = EnhanceItem.enhance(rewardItem, 'rare');
      } else if ( quality === 'epic' ) {
        rewardItem = EnhanceItem.enhance(rewardItem, 'epic');
      } else if ( quality === 'legendary' ) {
        rewardItem = EnhanceItem.enhance(rewardItem, 'legendary');
      } else if ( quality === 'artifact' ) {
        rewardItem = EnhanceItem.enhance(rewardItem, 'artifact');
      }

      this.addItem(rewardItem);
      rewardItem.emit('spawn');

      B.sayAt(this, `<green>Вы получили ${ItemUtil.display(rewardItem, 'vname')}.`);
      this.save();
    },
  },
};
