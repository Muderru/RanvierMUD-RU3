'use strict';

/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = (srcPath) => {
  const EventUtil = require(srcPath + 'EventUtil');
  const Player = require(srcPath + 'Player');

  return {
    event: state => (socket, args) => {
      let player = new Player({
        name: args.name,
        rname: args.rname,
        dname: args.dname,
        vname: args.vname,
        tname: args.tname,
        pname: args.pname,
        gender: args.gender,
        account: args.account,
        // TIP:DefaultAttributes: This is where you can change the default attributes for players
        attributes: {
          health: 100,
          strength: 20,
          agility: 20,
          intellect: 20,
          stamina: 20,
          armor: 0,
          critical: 0,
          cutting_resistance: 0,
          crushing_resistance: 0,
          piercing_resistance: 0,
          fire_resistance: 0,
          cold_resistance: 0,
          lightning_resistance: 0,
          earth_resistance: 0,
          acid_resistance: 0,
          chaos_resistance: 0,
          ether_resistance: 0,
          cutting_damage: 0,
          crushing_damage: 0,
          piercing_damage: 0,
          fire_damage: 0,
          cold_damage: 0,
          lightning_damage: 0,
          earth_damage: 0,
          acid_damage: 0,
          chaos_damage: 0,
          ether_damage: 0
        }
      });

      args.account.addCharacter(args.name);
      args.account.save();

      player.setMeta('class', args.playerClass);
      player.setMeta('attributePoints', 0);

      const room = state.RoomManager.startingRoom;
      player.room = room;
      player.save();

      // reload from manager so events are set
      player = state.PlayerManager.loadPlayer(state, player.account, player.name);
      player.socket = socket;

      socket.emit('done', socket, { player });
    }
  };
};
