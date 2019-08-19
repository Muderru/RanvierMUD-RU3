'use strict';

const { Config, Player } = require('ranvier');
const PlayerClass = require('../../classes/lib/PlayerClass');

/**
 * Finish player creation. Add the character to the account then add the player
 * to the game world
 */
module.exports = {
  event: state => {
    const startingRoomRef = Config.get('startingRoom');
    if (!startingRoomRef) {
      Logger.error('No startingRoom defined in ranvier.json');
    }

    return async (socket, args) => {
      let player = new Player({
        name: args.name,
        rname: args.rname,
        dname: args.dname,
        vname: args.vname,
        tname: args.tname,
        pname: args.pname,
        gender: args.gender,
        travelVerbIn: '',
        travelVerbOut: '',
        account: args.account,
      });


      // TIP:DefaultAttributes: This is where you can change the default attributes for players
      const defaultAttributes = {
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
      };

      for (const attr in defaultAttributes) {
        player.addAttribute(state.AttributeFactory.create(attr, defaultAttributes[attr]));
      }

      args.account.addCharacter(args.name);
      args.account.save();

      player.setMeta('class', args.playerClass);
      player.setMeta('attributePoints', 0);
      player.setMeta('magicPoints', 1);
      player.setMeta('skillPoints', 1);
      player.setMeta('skill_flee', 1);

      const room = state.RoomManager.getRoom(startingRoomRef);
      player.room = room;
      await state.PlayerManager.save(player);

      // reload from manager so events are set
      player = await state.PlayerManager.loadPlayer(state, player.account, player.name);
      player.socket = socket;

      if (player.gender === 'male') {
          player.travelVerbIn = 'пришёл';
          player.travelVerbOut = 'ушёл';
      } else if (player.gender === 'female') {
          player.travelVerbIn = 'пришла';
          player.travelVerbOut = 'ушла';
      } else {
          Logger.error('Error in travelVerb for ${player.name}');
      }

      socket.emit('done', socket, { player });
    };
  }
};
