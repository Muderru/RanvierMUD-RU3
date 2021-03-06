const { Logger, Broadcast, Damage } = require('ranvier');
const { Random } = require('rando-js');
const Combat = require('../../../combat/lib/Combat');

function poisonAttack(state, mob) {
  const poison = state.SpellManager.get('poison');
  for (const pc of mob.room.players) {
    Broadcast.sayAt(pc, `<b><green>${mob.Name} испускает во все стороны брызги яда.</green></b>`);
    poison.run(null, mob, pc);
  }
}

function glacialAttack(state, mob) {
  const glacial = state.SpellManager.get('ice_peak');
  for (const pc of mob.room.players) {
    Broadcast.sayAt(pc, `<b><blue>${mob.Name} испускает во все стороны ледяные осколки.</blue></b>`);
    glacial.run(null, mob, pc);
  }
}

function hunterAttack(state, mob) {
  for (const exit of mob.room.exits) {
    const room = state.RoomManager.getRoom(exit.roomId);
    if (room.players.size > 0) {
      target = Array.from(room.players)[Math.floor(Math.random() * room.players.size)];
      if (target.isInCombat()) {
        return;
      }
      let ending = '';
      if (mob.gender === 'male') {
        ending = '';
      } else if (mob.gender === 'female') {
        ending = 'а';
      } else if (mob.gender === 'plural') {
        ending = 'и';
      } else {
        ending = 'о';
      }
      Broadcast.sayAt(target, `<b><red>${mob.Name} бросил${ending} цепь с крюком и притянул${ending} вас к себе!</red></b>`);
      Broadcast.sayAtExcept(room, `<b><red>${mob.Name} бросил${ending} цепь с крюком и притянул${ending} ${target.vname} к себе!</red></b>`, target);
      target.moveTo(mob.room);
      mob.initiateCombat(target);
    }
  }
}

function executionerAttack(state, mob) {
  for (const pc of mob.room.players) {
    const healthCurrent = pc.getAttribute('health');
    const healthMax = pc.getMaxAttribute('health');
    if ((healthCurrent / healthMax) < 0.3) {
      let tmp = '';
      if (pc.gender === 'male') {
        tmp = 'его';
      } else if (pc.gender === 'female') {
        tmp = 'её';
      } else if (pc.gender === 'plural') {
        tmp = 'их';
      } else {
        tmp = 'его';
      }
      Broadcast.sayAt(pc, `${mob.Name} прекращает ваши мучения, одним ударом отрубая голову.`);
      Broadcast.sayAtExcept(pc.room, `${mob.Name} прекращает мучения ${pc.rname}, одним ударом отрубая ${tmp} голову.`, pc);
      const damage = new Damage('health', healthCurrent, null, mob);
      return damage.commit(pc);
    }
  }
}

/**
 * Специальные атаки и поведение боссов
 */
module.exports = {
  listeners: {
    updateTick: (state) => function () {
      if (!this.getMeta('boss')) {
        return;
      }

      if (this.hasAttribute('freedom') && this.getAttribute('freedom') < 0) {
        return;
      }

      if (Random.inRange(0, 100) <= 99) {
        return;
      }

      const abilities = this.getMeta('boss');
      const specialAttack = abilities[Math.floor(Math.random() * abilities.length)];
      if (specialAttack === 'poison') {
        if (!this.isInCombat()) {
          return;
        }
        return poisonAttack(state, this);
      } else if (specialAttack === 'glacial') {
        if (!this.isInCombat()) {
          return;
        }
        return glacialAttack(state, this);
      } else if (specialAttack === 'hunter') {
        if (this.isInCombat()) {
          return;
        }
        return hunterAttack(state, this);
      } else if (specialAttack === 'executioner') {
        if (!this.isInCombat()) {
          return;
        }
        return executionerAttack(state, this);
      }

    },
  },
};
