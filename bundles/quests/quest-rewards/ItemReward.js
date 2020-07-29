'use strict';

const { Broadcast: B } = require('ranvier');
const { QuestReward } = require('ranvier');

/**
 * Quest reward that gives item
 *
 * Config options:
 *   items: массив предметов, будет выбран случайный
 *   quality: качество предмета
 *
 */
module.exports = class ExperienceReward extends QuestReward {
  static reward(GameState, quest, config, player) {
    const item = this._getItem(quest, config, player)[0];
    const quality = this._getItem(quest, config, player)[1];
    if (player.isInventoryFull()) {
      return B.sayAt(player, '<red>Ваш инвентарь переполнен.</red>');
    }
    player.emit('itemReward', item, quality);
  }

  static display(GameState, quest, config, player) {
    const items = config.items;
    let reward = '';
    for (const item of items) {
      const rewardItem = GameState.ItemFactory.create(GameState.AreaManager.getAreaByReference(item), item);
      reward += `${rewardItem.name} `;
    }
    return `Случайный предмет из: <b>${reward}</b>`;
  }

  static _getItem(quest, config, player) {
    config = Object.assign({
      items: [],
      quality: '',
    }, config);

    const items = config.items;
    const quality = config.quality;
    let item = items[Math.floor(Math.random() * items.length)];
    if (!quality) {
      quality = common;
    }

    return [item, quality];
  }
};
