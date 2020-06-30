'use strict';

const { Random } = require('rando-js');
const { Damage, Logger, Broadcast } = require('ranvier');
const Parser = require('../../lib/lib/ArgParser');
const CombatErrors = require('./CombatErrors');

/**
 * This class is an example implementation of a Diku-style real time combat system. Combatants
 * attack and then have some amount of lag applied to them based on their weapon speed and repeat.
 */
class Combat {
  /**
   * Handle a single combat round for a given attacker
   * @param {GameState} state
   * @param {Character} attacker
   * @return {boolean}  true if combat actions were performed this round
   */
  static updateRound(state, attacker) {
    if (attacker.combatData.killed) {
      // entity was removed from the game but update event was still in flight, ignore it
      return false;
    }

    if (!attacker.isInCombat()) {
      if (!attacker.isNpc) {
        attacker.removePrompt('combat');
      }
      return false;
    }

    let lastRoundStarted = attacker.combatData.roundStarted;
    attacker.combatData.roundStarted = Date.now();

    // cancel if the attacker's combat lag hasn't expired yet
    if (attacker.combatData.lag > 0) {
      const elapsed = Date.now() - lastRoundStarted;
      attacker.combatData.lag -= elapsed;
      return false;
    }

    // currently just grabs the first combatant from their list but could easily be modified to
    // implement a threat table and grab the attacker with the highest threat
    let target = null;
    try {
      target = Combat.chooseCombatant(attacker);
    } catch (e) {
      attacker.removeFromCombat();
      attacker.combatData = {};
      throw e;
    }

    // no targets left, remove attacker from combat
    if (!target) {
      attacker.removeFromCombat();
      // reset combat data to remove any lag
      attacker.combatData = {};
      return false;
    }

    if (target.combatData.killed) {
      // entity was removed from the game but update event was still in flight, ignore it
      return false;
    }

    Combat.makeAttack(attacker, target);
    return true;
  }

  /**
   * Find a target for a given attacker
   * @param {Character} attacker
   * @return {Character|null}
   */
  static chooseCombatant(attacker) {
    if (!attacker.combatants.size) {
      return null;
    }

    for (const target of attacker.combatants) {
      if (!target.hasAttribute('health')) {
        throw new CombatErrors.CombatInvalidTargetError();
      }
      if (target.getAttribute('health') > 0) {
        return target;
      }
    }

    return null;
  }

  /**
   * Actually apply some damage from an attacker to a target
   * @param {Character} attacker
   * @param {Character} target
   */
  static makeAttack(attacker, target) {
    let addDamage = 0;
    let combatAttributes = [ 'cutting', 'crushing', 'piercing', 'fire', 'cold', 
                             'lightning', 'earth', 'acid', 'chaos', 'ether' ];
    
    for (let combatAttribute of combatAttributes) {
      let attackAttribute = combatAttribute + '_damage';
      let defenceAttribute = combatAttribute + '_resistance';
      if (attacker.hasAttribute(attackAttribute)) {
        if (target.hasAttribute(defenceAttribute)) {
          if (attacker.getAttribute(attackAttribute) > target.getAttribute(defenceAttribute)) {
            addDamage += attacker.getAttribute(attackAttribute) - target.getAttribute(defenceAttribute);
          }
        } else {
            addDamage += attacker.getAttribute(attackAttribute);
        }
      }
    }

    let amount = this.calculateWeaponDamage(attacker);
    let critical = false;

    if (attacker.isNpc) {
        amount = Random.inRange(attacker.min_damage, attacker.max_damage);
    }

    if (target.hasAttribute('armor')) {
      if (amount > target.getAttribute('armor')) {
          amount = Math.floor(1 + ((amount - target.getAttribute('armor'))*(amount - target.getAttribute('armor'))/(amount + target.getAttribute('armor'))));
      } else {
          amount = 1;
      }
    }

//    Logger.verbose(`addDamage ${addDamage}`);
    amount += addDamage;
    if (attacker.hasAttribute('critical')) {
      let critChance = Math.max(attacker.getMaxAttribute('critical') || 0, 0);
      if (target.hasAttribute('armor')) {
        critChance -= 0.2*target.getAttribute('armor');
      }

      if (critChance > 90) {
        critChance = 90;
      }

      if (critChance > 0) { 
        critical = Random.probability(critChance);
        if (critical) {
          amount = Math.ceil(amount * 2.5 
                                    * (1 + (attacker.getAttribute('critical_damage_percent')/100))
                                    * (1 - (target.getAttribute('critical_damage_reduction_percent')/100))
          );
        }
      }
    }

    const weapon = attacker.equipment.get('оружие');
    const damage = new Damage('health', amount, attacker, weapon || attacker, { critical });
    let detectInvis = 0;
    let detectHide = 0;

    if (attacker.hasAttribute('detect_invisibility')) {
      detectInvis = attacker.getAttribute('detect_invisibility');
    }

    if (attacker.hasAttribute('detect_hide')) {
      detectHide = attacker.getAttribute('detect_hide');
    }

    if (attacker.hasAttribute('freedom') && attacker.getAttribute('freedom') < 0) {
      Broadcast.sayAt(attacker, `<b><red>Ваши мышцы вялы и вы не можете двигаться!</red></b>`);
    } else if (target.hasAttribute('invisibility') && target.getAttribute('invisibility') > detectInvis) {
      Broadcast.sayAt(target, `${attacker.Name} не видит вас и не может по вам попасть.`);
      Broadcast.sayAt(attacker, `Вы не видите ${target.vname} и не можете нанести урона.`);
      Broadcast.sayAtExcept(target.room, `${attacker.Name} не видит ${target.vname} и не наносит урона.`, [attacker, target]);
    } else if (target.hasAttribute('hide') && target.getAttribute('hide') > detectHide) {
      Broadcast.sayAt(target, `${attacker.Name} не замечает вас и не может по вам попасть.`);
      Broadcast.sayAt(attacker, `Вы не видите ${target.vname} и не можете нанести урона.`);
      Broadcast.sayAtExcept(target.room, `${attacker.Name} не замечает ${target.vname} и не наносит урона.`, [attacker, target]);
    } else {
      damage.commit(target);
    }

    // currently lag is really simple, the character's weapon speed = lag
    attacker.combatData.lag = this.getWeaponSpeed(attacker) * 1000;
  }

  /**
   * Any cleanup that has to be done if the character is killed
   * @param {Character} deadEntity
   * @param {?Character} killer Optionally the character that killed the dead entity
   */
  static handleDeath(state, deadEntity, killer) {
    if (deadEntity.combatData.killed) {
      return;
    }

    deadEntity.combatData.killed = true;
    deadEntity.removeFromCombat();

    Logger.log(`${killer ? killer.name : 'Something'} killed ${deadEntity.name}.`);

    if (killer) {
      deadEntity.combatData.killedBy = killer;
      killer.emit('deathblow', deadEntity);
    }
    deadEntity.emit('killed', killer);

    if (deadEntity.isNpc) {
      if (deadEntity.gender === 'male') {
        Broadcast.sayAt(deadEntity.room, `${deadEntity.Name} мертв.`);
      } else if (deadEntity.gender === 'female') {
        Broadcast.sayAt(deadEntity.room, `${deadEntity.Name} мертва.`);
      } else if (deadEntity.gender === 'plural') {
        Broadcast.sayAt(deadEntity.room, `${deadEntity.Name} мертвы.`);
      } else {
        Broadcast.sayAt(deadEntity.room, `${deadEntity.Name} мертво.`);
      }

      deadEntity.sourceRoom.removeNpc(deadEntity, true);
      killer.room.removeNpc(deadEntity, true);
      state.MobManager.removeMob(deadEntity);
    }
  }

  static startRegeneration(state, entity) {
    if (entity.hasEffectType('regen')) {
      return;
    }

    let regenEffect = state.EffectFactory.create('regen', { hidden: true }, { magnitude: 15 });
    if (entity.addEffect(regenEffect)) {
      regenEffect.activate();
    }
  }

  /**
   * @param {string} args
   * @param {Player} player
   * @return {Entity|null} Found entity... or not.
   */
  static findCombatant(attacker, search) {
    if (!search.length) {
      return null;
    }

    let possibleTargets = [...attacker.room.npcs];
    if (attacker.getMeta('pvp')) {
      possibleTargets = [...possibleTargets, ...attacker.room.players];
    }

    const target = Parser.parseDot(search, possibleTargets);

    if (!target) {
      return null;
    }

    if (target === attacker) {
      throw new CombatErrors.CombatSelfError("Вы ударили самого себя по лицу. Взбодрило!");
    }

    if (target.isNpc && !target.hasBehavior('combat')) {
      throw new CombatErrors.CombatPacifistError(`${target.Name} - пацифист и не будет сражаться с вами.`, target);
    }

    if (!target.hasAttribute('health')) {
      throw new CombatErrors.CombatInvalidTargetError("Вы не можете атаковать эту цель.");
    }

    if (!target.isNpc && !target.getMeta('pvp')) {
      throw new CombatErrors.CombatNonPvpError(`${target.name} не в режиме ПвП.`, target);
    }

    return target;
  }

  /**
   * Generate an amount of weapon damage
   * @param {Character} attacker
   * @param {boolean} average Whether to find the average or a random between min/max
   * @return {number}
   */
  static calculateWeaponDamage(attacker) {
    let weaponDamage = this.getWeaponDamage(attacker);
    let amount = 0;
    amount = Random.inRange(weaponDamage.min, weaponDamage.max);
    return this.normalizeWeaponDamage(attacker, amount);
  }

  /**
   * Get the damage of the weapon the character is wielding
   * @param {Character} attacker
   * @return {{max: number, min: number}}
   */
  static getWeaponDamage(attacker) {
    const weapon = attacker.equipment.get('оружие');
    let min = 0, max = 0;
    if (attacker.isNpc) {
      min = attacker.min_damage;
      max = attacker.max_damage;
    }
    if (weapon) {
      min = weapon.metadata.minDamage;
      max = weapon.metadata.maxDamage;
    }

    return {
      max,
      min
    };
  }

  /**
   * Get the speed of the currently equipped weapon
   * @param {Character} attacker
   * @return {number}
   */
  static getWeaponSpeed(attacker) {
    let speed = 2.5;
    const weapon = attacker.equipment.get('оружие');
    if (!attacker.isNpc && weapon) {
      speed = weapon.metadata.speed;
    }

    return speed * (1 - (attacker.getAttribute('swift')/100));
  }

  /**
   * Get a damage amount adjusted by attack power/weapon speed
   * @param {Character} attacker
   * @param {number} amount
   * @return {number}
   */
  static normalizeWeaponDamage(attacker, amount) {
    let speed = this.getWeaponSpeed(attacker);
    amount += attacker.hasAttribute('strength') ? attacker.getAttribute('strength') : attacker.level;
    return Math.round(amount / 3.5 * speed);
  }
}

module.exports = Combat;
