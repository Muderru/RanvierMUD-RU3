const { Broadcast, Logger, Config } = require('ranvier');
const { Random } = require('rando-js');
const EnhanceMob = require('../../../lib/lib/EnhanceMob');
const MaterialsUtil = require('../../../crafting/lib/MaterialsUtil');

const bossChance = 5; //шанс лоада босса
const plantChance = 5; //шанс лоада растения

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
            //добавляем растения по зоне
            for (const roomType of room.type) {
              if (Random.inRange(0, 100) <= plantChance) {
                const plant = room.spawnItem(state, MaterialsUtil.plant(roomType));
                const delayBehavior = state.ItemBehaviorManager.get('decay');
                delayBehavior.attach(plant, {duration: respawnInterval});
                Logger.verbose(`PLANT added ${this.name}:${room.id}.`);
              }
            }
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
        let mob = this.spawnNpc(state, defaultNpc.id);
        if (mob.hasBehavior('aggro')) {
          if (Random.inRange(0, 100) <= bossChance) {
            EnhanceMob.enhance(state, mob);
            if (Random.inRange(0, 100) <= 25) { //шанс добавления второй особенности босса
              EnhanceMob.enhance(state, mob);
            }
            if (Random.inRange(0, 100) <= 25) { //шанс добавления третьей особенности босса
              EnhanceMob.enhance(state, mob);
            }
            Logger.verbose(`BOSS added ${mob.entityReference}`);
          }
        }
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
