'use strict';

const { CommandType, Room, Broadcast, PlayerRoles } = require('ranvier');

/**
 * Interpreter.. you guessed it, interprets command input
 */
class CommandParser {
  /**
   * Parse a given string to find the resulting command/arguments
   * @param {GameState} state
   * @param {string} data
   * @param {Player} player
   * @return {{
   *   type: CommandType,
   *   command: Command,
   *   skill: Skill,
   *   channel: Channel,
   *   args: string,
   *   originalCommand: string
   * }}
   */
  static parse(state, data, player) {
    if (player.hasAttribute('freedom') && player.getAttribute('freedom') < 0 && player.role !== PlayerRoles.ADMIN) {
      return Broadcast.sayAt(player, `<b><red>Ваши мышцы вялы и вы не можете двигаться!</red></b>`);
    }

    data = data.trim();

    const parts = data.split(' ');

    const command = parts.shift().toLowerCase();
    if (!command.length) {
      throw new InvalidCommandError();
    }

    const args = parts.join(' ');

    // Kludge so that 'l' alone will always force a look,
    // instead of mixing it up with lock or list.
    // TODO: replace this a priority list
    if (command === 'см') {
      return {
        type: CommandType.COMMAND,
        command: state.CommandManager.get('look'),
        args: args
      };
    }

    // Same with 'i' and inventory.
    if (command === 'и' || command === 'инв') {
      return {
        type: CommandType.COMMAND,
        command: state.CommandManager.get('inventory'),
        args: args
      };
    }

    // Сокращения для экипировки.
    if (command === 'э' || command === 'экип') {
      return {
        type: CommandType.COMMAND,
        command: state.CommandManager.get('equipment'),
        args: args
      };
    }
    
    // Сокращения для оглядеться.
    if (command === 'огл') {
      return {
        type: CommandType.COMMAND,
        command: state.CommandManager.get('scan'),
        args: args
      };
    }

    // see if they matched a direction for a movement command
    const roomDirection = this.checkMovement(player, command);
    
    if (roomDirection) {
      const roomExit = this.canGo(player, roomDirection);
    
      return {
        type: CommandType.MOVEMENT,
        args,
        originalCommand: command,
        roomExit,
      };
    }

    // see if they matched exactly a command
    if (state.CommandManager.get(command)) {
      return {
        type: CommandType.COMMAND,
        command: state.CommandManager.get(command),
        args,
        originalCommand: command
      };
    }

    // see if they typed at least the beginning of a command and try to match
    let found = state.CommandManager.find(command, /* returnAlias: */ true);
    if (found) {
      return {
        type: CommandType.COMMAND,
        command: found.command,
        args,
        originalCommand: found.alias
      };
    }

    // check channels
    found = state.ChannelManager.find(command);
    if (found) {
      return {
        type: CommandType.CHANNEL,
        channel: found,
        args
      };
    }

    // finally check skills
    found = state.SkillManager.find(command);
    if (found) {
      return {
        type: CommandType.SKILL,
        skill: found,
        args
      };
    }

    throw new InvalidCommandError();
  }

  /**
   * Check command for partial match on primary directions, or exact match on secondary name or abbreviation
   * @param {Player} player
   * @param {string} command
   * @return {?string}
   */
  static checkMovement(player, command)
  {
    if (!player.room || !(player.room instanceof Room)) {
      return null;
    }

    const primaryDirections = ['север', 'юг', 'восток', 'запад', 'вверх', 'вниз'];

    for (const direction of primaryDirections) {
      if (direction.indexOf(command) === 0) {
        return direction;
      }
    }

    const secondaryDirections = [
      { abbr: 'св', name: 'северо-восток' },
      { abbr: 'сз', name: 'северо-запад' },
      { abbr: 'юв', name: 'юго-восток' },
      { abbr: 'юз', name: 'юго-запад' }
    ];

    for (const direction of secondaryDirections) {
      if (direction.abbr === command || direction.name.indexOf(command) === 0) {
        return direction.name;
      }
    }

    const otherExit = player.room.getExits().find(roomExit => roomExit.direction === command);

    return otherExit ? otherExit.direction : null;
  }

  /**
   * Determine if a player can leave the current room to a given direction
   * @param {Player} player
   * @param {string} direction
   * @return {boolean}
   */
  static canGo(player, direction)
  {
    if (!player.room) {
      return false;
    }

    switch(direction) {
      case 'з':
        direction = 'запад';
        break;
      case 'с':
        direction = 'север';
        break;
      case 'ю':
        direction = 'юг';
        break;
      case 'в':
        direction = 'восток';
        break;
      case 'вв':
        direction = 'вверх';
        break;
      case 'вн':
        direction = 'вниз';
        break;
    }

    return player.room.getExits().find(roomExit => roomExit.direction === direction) || false;
  }
}
exports.CommandParser = CommandParser;

/**
 * Used when the player enters a bad command
 * @extends Error
 */
class InvalidCommandError extends Error {}
/**
 * Used when the player tries a command they don't have access to
 * @extends Error
 */
class RestrictedCommandError extends Error {}
exports.InvalidCommandError = InvalidCommandError;
exports.RestrictedCommandError = RestrictedCommandError;
