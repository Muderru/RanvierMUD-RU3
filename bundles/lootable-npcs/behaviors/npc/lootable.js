'use strict';

const LootTable = require('../../lib/LootTable');
const { Player, Item, Logger } = require('ranvier');

module.exports = {
  listeners: {
    killed: state => async function (config, killer) {
      const { room, name, rname, dname, vname, tname, pname, gender, area, keywords } = this;

      const lootTable = new LootTable(state, config);
      const currencies = lootTable.currencies();
      const roll = await lootTable.roll();
      const items = roll.map(
        item => state.ItemFactory.create(state.AreaManager.getAreaByReference(item), item)
      );

      const corpse = new Item(area, {
        id: 'corpse',
        name: `труп ${rname}`,
        rname: `трупа ${rname}`,
        dname: `трупу ${rname}`,
        vname: `труп ${rname}`,
        tname: `трупом ${rname}`,
        pname: `трупе ${rname}`,
        gender: 'male',
        roomDesc: `Труп ${rname}`,
        description: `Это гниющий труп ${rname}`,
        keywords: keywords.concat(['труп']),
        type: 'CONTAINER',
        metadata: {
          noPickup: true,
        },
        maxItems: items.length,
        behaviors: {
          decay: {
            duration: 180
          }
        },
      });
      corpse.hydrate(state);

      Logger.log(`Generated corpse: ${corpse.uuid}`);

      items.forEach(item => {
        item.hydrate(state);
        corpse.addItem(item);
      });
      room.addItem(corpse);
      state.ItemManager.add(corpse);

      if (killer.getMeta('config.автосбор') === true) {
        state.CommandManager.get('get').execute(this.keywords[0] || 'труп', killer, 'взятьвсе');
      }

      if (killer && killer instanceof Player) {
        if (currencies) {
          currencies.forEach(currency => {
            // distribute currency among group members in the same room
            const recipients = (killer.party ? [...killer.party] : [killer]).filter(recipient => {
              return recipient.room === killer.room;
            });

            let remaining = currency.amount;
            for (const recipient of recipients) {
              // Split currently evenly amount recipients.  The way the math works out the leader
              // of the party will get any remainder if the currency isn't divisible evenly
              const amount = Math.floor(remaining / recipients.length) + (remaining % recipients.length);
              remaining -= amount;

              recipient.emit('currency', currency.name, amount);
              state.CommandManager.get('look').execute(corpse.uuid, recipient);
            }
          });
        }
      }
    }
  }
};
