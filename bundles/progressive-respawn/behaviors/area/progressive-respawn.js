const { Broadcast, Logger, Config } = require('ranvier');
const { Random } = require('rando-js');

/**
 * Behavior for having a constant respawn tick happening every [interval]
 * seconds. As opposed to one giant full area respawn every 10 minutes this will
 * constantly try to respawn an entity (item/npc) in an area's rooms based on
 * the entity's respawn chance until it hits the entity's maxLoad for the room.
 *
 * config:
 *   interval: number=30
 */
module.exports = {
  listeners: {
    updateTick: (state) => {
      const tickFrequency = Config.get('entityTickFrequency', 100);
      const serverStartTime = Math.trunc(Date.now() / tickFrequency);
      return function (config) {
        const respawnInterval = config.interval || 30;
        const upTime = Math.trunc(Date.now() / tickFrequency - serverStartTime);
        if (upTime % (respawnInterval * (1000 / tickFrequency)) === 0) {
          for (const [id, room] of this.rooms) {
            room.emit('respawnTick', state);
          }
          this.npcs.forEach((npc) => {
            npc.emit('respawnTick');
          });
        }
      };
    },

    roomAdded: (state) => function (config, room) {
      room.on('respawnTick', _respawnRoom.bind(room));
    },
  },
};

function _respawnRoom(state) {
  // relock/close doors
  this.doors = new Map(Object.entries(JSON.parse(JSON.stringify(this.defaultDoors || {}))));

  this.defaultNpcs.forEach((defaultNpc) => {
    if (typeof defaultNpc === 'string') {
      defaultNpc = { id: defaultNpc };
    }

    defaultNpc = {
      respawnChance: 100,
      maxLoad: 1,
      replaceOnRespawn: false,
      ...defaultNpc,
    };

    const npcCount = [...this.spawnedNpcs].filter((npc) => npc.entityReference === defaultNpc.id).length;
    const needsRespawn = npcCount < defaultNpc.maxLoad;

    if (!needsRespawn) {
      return;
    }

    if (Random.probability(defaultNpc.respawnChance)) {
      try {
        this.spawnNpc(state, defaultNpc.id);
        Broadcast.sayAt(this, 'Тут кто-то появился.');
      } catch (err) {
        Logger.error(err.message);
      }
    }
  });

  this.defaultItems.forEach((defaultItem) => {
    if (typeof defaultItem === 'string') {
      defaultItem = { id: defaultItem };
    }

    defaultItem = {
      respawnChance: 100,
      maxLoad: 1,
      replaceOnRespawn: false,
      ...defaultItem,
    };

    const itemCount = [...this.items].filter((item) => item.entityReference === defaultItem.id).length;
    const needsRespawn = itemCount < defaultItem.maxLoad;

    if (!needsRespawn && !defaultItem.replaceOnRespawn) {
      return;
    }

    if (Random.probability(defaultItem.respawnChance)) {
      if (defaultItem.replaceOnRespawn) {
        this.items.forEach((item) => {
          if (item.entityReference === defaultItem.id) {
            state.ItemManager.remove(item);
          }
        });
      }
      this.spawnItem(state, defaultItem.id);
    }
  });
}
