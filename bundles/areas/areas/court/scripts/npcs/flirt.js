const { Broadcast } = require('ranvier');

module.exports = {
  listeners: {
    playerEnter: (state) => function (player) {
      if (this.room.players.size < 1) {
        return;
      }

      const rand = Math.floor((Math.random() * 100) + 1);

      if (rand >= 70) {
        return;
      }

      const target = [...this.room.players][Math.floor(Math.random() * this.room.players.size)];

      let ending = [];
      if (target.gender === 'male') {
        ending = ['', 'ёл'];
      } else if (target.gender === 'female') {
        ending = ['а', 'ла'];
      } else if (target.gender === 'plural') {
        ending = ['и', 'ли'];
      } else {
        ending = ['о', 'ло'];
      }

      Broadcast.sayAt(target, 'Молодая горожанка начала заигрывать с вами.');
      Broadcast.sayAt(target, 'В ваших глазах вспыхнула страсть и вы пошли за горожанкой!');
      Broadcast.sayAtExcept(target.room, `В глазах ${target.rname} вспыхнула страсть, и он${ending[0]} пош${ending[1]} за горожанкой!`, target);
      const targetRoomId = `court:4020${Math.floor(Math.random() * 10)}`;
      const targetRoom = state.RoomManager.getRoom(targetRoomId);
      target.moveTo(targetRoom);
      this.moveTo(targetRoom);
      state.ChannelManager.get('say').send(state, this, 'А, теперь раздевайся... И отдавай все деньги!');
      this.initiateCombat(target);
    },
  },
};
