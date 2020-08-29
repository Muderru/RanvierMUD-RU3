const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    spawn: (state) => function () {
      Broadcast.sayAt(this.room, 'Мелкий демон появился из облака серы.');
    },

    updateTick: (state) => function () {
      if (this.isInCombat()) {
        return;
      }

      if (this.following && this.following.isInCombat()) {
        state.CommandManager.get('assist').execute(this.following.name, this);
      }
    },

    unfollowed: (state) => function () {
      Broadcast.sayAt(this.room, 'Мелкий демон растворился в облаке серы.');
      this.room.removeNpc(this, true);
    },

    hit: (state) => function (damage, target, finalAmount) {
      if (this.following && this.isNpc) {
        let buf = '';
        if (damage.source !== this) {
          if (damage.source.gender === 'male') {
            buf = `<b>${damage.source.Name}</b> ${this.rname} ударил`;
          } else if (damage.source.gender === 'female') {
            buf = `<b>${damage.source.Name}</b> ${this.rname} ударила`;
          } else if (damage.source.gender === 'plural') {
            buf = `<b>${damage.source.Name}</b> ${this.rname} ударили`;
          } else {
            buf = `<b>${damage.source.Name}</b> ${this.rname} ударило`;
          }
        } else {
          buf = `${this.Name} ${this.damageVerb}`;
        }

        buf += ` <b>${target.vname}</b> на <b>${finalAmount}</b> урона.`;
        Broadcast.sayAt(this.following, buf);

        if (!this.following.party) {
          return;
        }

        for (const member of this.following.party) {
          Broadcast.sayAt(member, buf);
        }
      }
    },
  },
};
