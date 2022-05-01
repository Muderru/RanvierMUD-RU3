const { Broadcast, Damage } = require('ranvier');

module.exports = {
  listeners: {
    command: (state) => function (player, commandName, args) {
      if (commandName !== 'нажать') {
        return;
      }

      if (!args) {
        return Broadcast.sayAt(player, 'Что вы хотите нажать?');
      }

      let ending = '';
      if (player.gender === 'male') {
        ending = '';
      } else if (player.gender === 'female') {
        ending = 'а';
      } else if (player.gender === 'plural') {
        ending = 'и';
      } else {
        ending = 'о';
      }

      if ((args === 'красный') || (args === 'красный корешок')) {
        const room1 = state.RoomManager.getRoom('court:40241');
        const room2 = state.RoomManager.getRoom('court:40229');
        const shelf = Array.from(player.room.items).find((item) => item.entityReference === 'court:40241');
        const lever1 = Array.from(room1.items).find((item) => item.entityReference === 'court:40236');
        const lever2 = Array.from(room2.items).find((item) => item.entityReference === 'court:40240');
        if (shelf && lever1 && lever2) {
          player.room.exits.push({ roomId: 'court:40255', direction: 'север', inferred: true });
          Broadcast.sayAt(player, 'Вы нажали на красный корешок и в шкафу открылась потайная дверь.');
          Broadcast.sayAtExcept(player.room, `${player.Name} нажал${ending} на красный корешок и в шкафу открылась потайная дверь.`, player);
          player.room.spawnItem(state, 'court:40242');
          return player.room.removeItem(shelf);
        } else {
          Broadcast.sayAt(player, 'Вы нажали что-то не так и в комнате сработала ловушка.');
          Broadcast.sayAtExcept(player.room, `${player.Name} нажал${ending} что-то не так и в комнате сработала ловушка.`, player);
          Broadcast.sayAt(player.room, 'Со всех сторон в вас полетели острые дротики.');
          for (const pc of player.room.players) {
            const damage = new Damage('health', Math.random() * 100, null, this);
            damage.commit(pc);
          }
        }
      } else {
        Broadcast.sayAt(player, 'Вы нажали что-то не так и в комнате сработала ловушка.');
        Broadcast.sayAtExcept(player.room, `${player.Name} нажал${ending} что-то не так и в комнате сработала ловушка.`, player);
        Broadcast.sayAt(player.room, 'Со всех сторон в вас полетели острые дротики.');
        for (const pc of player.room.players) {
          const damage = new Damage('health', Math.random() * 100, null, this);
          damage.commit(pc);
        }
      }
    },

    respawnTick: (state) => function () {
      if (this.exits.length > 1) {
        this.exits.splice(1, 1);
      }

      for (const item of this.items) {
        this.removeItem(item);
      }

      this.spawnItem(state, 'court:40241');
    },
  },
};
