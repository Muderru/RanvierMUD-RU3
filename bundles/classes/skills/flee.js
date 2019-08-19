'use strict';

const { Random } = require('rando-js');
const { Broadcast, SkillType } = require('ranvier');
const { CommandParser } = require('../..//lib/lib/CommandParser');
const say = Broadcast.sayAt;

const manaCost = 40;

/**
 * Команда переделана под умение, чтобы был лаг на применение
 */
module.exports = {
  aliases: ['бежать', 'убежать', 'сбежать'],
  name: 'Сбежать',
  type: SkillType.SKILL,
  requiresTarget: false,
  initiatesCombat: false,
  resource: {
    attribute: 'mana',
    cost: manaCost,
  },
  cooldown: 100,

  run: state => (direction, player) => {
    if (!player.isInCombat()) {
      return say(player, "Вы вздрагиваете от вида собственной тени.");
    }


    let roomExit = null;
    if (direction) {
      roomExit = CommandParser.canGo(player, direction);
    } else {
      roomExit = Random.fromArray(player.room.getExits());
    }

    const randomRoom = state.RoomManager.getRoom(roomExit.roomId);

    if (!randomRoom) {
      say(player, "Вы не знаете куда бежать!");
      return;
    }


    const door = player.room.getDoor(randomRoom) || randomRoom.getDoor(player.room);
    if (randomRoom && door && (door.locked || door.closed)) {
      say(player, "Вы с разбега ударились в закрытую дверь!");
      return;
    }

    say(player, "С гордо поднятой головой вы сбегаете из битвы!");
    
    if (player.gender === 'male') {
       Broadcast.sayAtExcept(player.room, `${player.name} сбежал из боя.`, player);
    } else if (player.gender === 'female') {
       Broadcast.sayAtExcept(player.room, `${player.name} сбежала из боя.`, player);
    } else if (player.gender === 'plural') {
       Broadcast.sayAtExcept(player.room, `${player.name} сбежали из боя.`, player);
    } else {
       Broadcast.sayAtExcept(player.room, `${player.name} сбежало из боя.`, player);
    }
    
    player.removeFromCombat();
    player.emit('move', { roomExit });
  },

  info: (player) => {
      return `Вы пытаетесь спастись бегством.`;
  }
};
