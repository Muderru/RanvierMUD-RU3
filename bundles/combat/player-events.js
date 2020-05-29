'use strict';

const { Config, Broadcast: B } = require('ranvier');
const Combat = require('./lib/Combat');
const CombatErrors = require('./lib/CombatErrors');
const LevelUtil = require('../lib/lib/LevelUtil');
const WebsocketStream = require('../websocket-networking/lib/WebsocketStream');

/**
 * Auto combat module
 */
module.exports = {
  listeners: {
    updateTick: state => function () {
      Combat.startRegeneration(state, this);

      let hadActions = false;
      try {
        hadActions = Combat.updateRound(state, this);
      } catch (e) {
        if (e instanceof CombatErrors.CombatInvalidTargetError) {
          B.sayAt(this, "Вы не можете атаковать эту цель.");
        } else {
          throw e;
        }
      }

      if (!hadActions) {
        return;
      }

      const usingWebsockets = this.socket instanceof WebsocketStream;
      // don't show the combat prompt to a websockets server
      if (!this.hasPrompt('combat') && !usingWebsockets) {
        this.addPrompt('combat', _ => promptBuilder(this));
      }

      B.sayAt(this, '');
      if (!usingWebsockets) {
        B.prompt(this);
      }
    },

    /**
     * When the player hits a target
     * @param {Damage} damage
     * @param {Character} target
     */
    hit: state => function (damage, target, finalAmount) {
      if (damage.metadata.hidden) {
        return;
      }

      let buf = '';
      if (damage.source !== this) {
          if (damage.source.gender === 'male') {
            buf = `Ваш <b>${damage.source.name}</b> ${damage.source.damageVerb}`;
          } else if (damage.source.gender === 'female') {
            buf = `Ваша <b>${damage.source.name}</b> ${damage.source.damageVerb}`;
          } else if (damage.source.gender === 'plural') {
            buf = `Ваши <b>${damage.source.name}</b> ${damage.source.damageVerb}`;
          } else {
            buf = `Ваше <b>${damage.source.name}</b> ${damage.source.damageVerb}`;
          }
        } else {
          buf = "Вы ударили";
        }

      buf += ` <b>${target.vname}</b> на <b>${finalAmount}</b> урона.`;

      if (damage.metadata.critical) {
        buf += ' <red><b>(Критический урон)</b></red>';
      }

      B.sayAt(this, buf);

      if (this.equipment.has('оружие')) {
        this.equipment.get('оружие').emit('hit', damage, target, finalAmount);
      }

      // show damage to party members
      if (!this.party) {
        return;
      }

      for (const member of this.party) {
        if (member === this || member.room !== this.room) {
          continue;
        }

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
          if (this.gender === 'male') {
            buf = `${this.Name} ударил`;
          } else if (this.gender === 'female') {
            buf = `${this.Name} ударила`;
          } else if (this.gender === 'plural') {
            buf = `${this.Name} ударили`;
          } else {
            buf = `${this.Name} ударило`;
          }
        }

        buf += ` <b>${target.vname}</b> на <b>${finalAmount}</b> урона.`;
        B.sayAt(member, buf);
      }
    },

    /**
     * @param {Heal} heal
     * @param {Character} target
     */
    heal: state => function (heal, target) {
      if (heal.metadata.hidden) {
        return;
      }

      if (target !== this) {
        let buf = '';
        if (heal.source !== this) {
          if (heal.source.gender === 'male') {
            buf = `Ваш <b>${heal.source.name}</b> вылечил`;
          } else if (heal.source.gender === 'female') {
            buf = `Ваша <b>${heal.source.name}</b> вылечила`;
          } else if (heal.source.gender === 'plural') {
            buf = `Ваши <b>${heal.source.name}</b> вылечили`;
          } else {
            buf = `Ваше <b>${heal.source.name}</b> вылечило`;
          }
        } else {
          buf = "Вы вылечили";
        }

        buf += `<b> ${target.vname}</b> <b><green>${finalAmount}</green></b> ${heal.attribute}.`;
        B.sayAt(this, buf);
      }

      // show heals to party members
      if (!this.party) {
        return;
      }

      for (const member of this.party) {
        if (member === this || member.room !== this.room) {
          continue;
        }

        let buf = '';
        if (heal.source !== this) {
          if (heal.source.gender === 'male') {
            buf = `<b>${heal.source.Name}</b> ${this.rname} вылечил`;
          } else if (heal.source.gender === 'female') {
            buf = `<b>${heal.source.Name}</b> ${this.rname} вылечила`;
          } else if (heal.source.gender === 'plural') {
            buf = `<b>${heal.source.Name}</b> ${this.rname} вылечила`;
          } else {
            buf = `<b>${heal.source.Name}</b> ${this.rname} вылечило`;
          }
        } else {
          buf = `${this.Name} вылечил`;
        }

        buf += ` <b>${target.vname}</b>`;
        buf += ` <b><green>${finalAmount}</green></b> ${heal.attribute}.`;
        B.sayAt(member, buf);
      }
    },

    damaged: state => function (damage, finalAmount) {
      if (damage.metadata.hidden || damage.attribute !== 'health') {
        return;
      }

      let buf = '';
      if (damage.attacker) {
        buf = `<b>${damage.attacker.Name}</b>`;
          if (!damage.attacker.damageVerb) {
            if (damage.attacker.gender === 'male') {
               damage.attacker.damageVerb = 'поранил';
            } else if (damage.attacker.gender === 'female') {
               damage.attacker.damageVerb = 'поранила';
            } else if (damage.attacker.gender === 'plural') {
               damage.attacker.damageVerb = 'поранили';
            } else {
               damage.attacker.damageVerb = 'поранило';
            }
        }
      }

      if (damage.attacker) {
      if (damage.attacker.name === damage.source.name) {
          buf += ` ${damage.attacker.damageVerb} <b>Ваc</b>, нанося <b><red>${finalAmount}</red></b> урона.`;
      } else {
          buf = `Вы получили <b><red>${finalAmount}</red></b> урона `;
          if (damage.source !== damage.attacker) {
            buf += `(<b>${damage.source.name} от ${damage.attacker.rname}</b>).`;
          } else if (!damage.attacker) {
            buf += "от чего-то.";
          }
      }
      }

      if (damage.metadata.critical) {
        buf += ' <red><b>(Критический урон)</b></red>';
      }

      B.sayAt(this, buf);

      if (this.party) {
        // show damage to party members
        for (const member of this.party) {
          if (member === this || member.room !== this.room) {
            continue;
          }

          let buf = '';
          if (damage.attacker) {
              buf = `${damage.attacker.Name} ${damage.attacker.damageVerb}`;
          }

          if (damage.source !== damage.attacker) {
            let damageVerb = '';
            if (!damage.source.damageVerb) {
              if (damage.source.gender === 'plural') {
                damageVerb = 'ранят';
              } else {
                damageVerb = 'ранит';
              }
            } else {
              damageVerb = damage.source.damageVerb;
            }
            let damageSourceName = damage.source.name[0].toUpperCase() + damage.source.name.slice(1);
            buf = `<b>${damageSourceName} ${damage.attacker.rname} ${damageVerb}</b>`;
          } else if (!damage.attacker) {
            buf += "Что-то поранило";
          }

          buf += ` <b>${this.vname}</b> на <b><red>${finalAmount}</red></b> урона.`;
          B.sayAt(member, buf);
        }
      }

      if (this.getAttribute('health') <= 0) {
        Combat.handleDeath(state, this, damage.attacker);
      }
    },

    healed: state => function (heal, finalAmount) {
      if (heal.metadata.hidden) {
        return;
      }

      let buf = '';
      let attacker = '';
      let source = '';

      if (heal.attacker && heal.attacker !== this) {
        attacker = `<b>${heal.attacker.name}</b> `;
      }

      if (heal.source !== heal.attacker) {
        attacker = " " + `${attacker.rname}`;
        source = `<b>${heal.source.name[0].toUpperCase()+heal.source.name.slice(1)}</b>`;
      } else if (!heal.attacker) {
        source = "Что-то";
      }

      if (heal.attribute === 'health') {
        if (heal.source.gender === 'male') {
          buf = `${source} восстановил вам <b><red>${finalAmount}</red></b> жизни.`;
        } else if (heal.source.gender === 'female') {
          buf = `${source} восстановила вам <b><red>${finalAmount}</red></b> жизни.`;
        } else if (heal.source.gender === 'plural') {
          buf = `${source} восстановили вам <b><red>${finalAmount}</red></b> жизни.`;
        } else {
          buf = `${source} восстановило вам <b><red>${finalAmount}</red></b> жизни.`;
        }
      } else if (heal.attribute === 'mana') {
        if (heal.source.gender === 'male') {
          buf = `${source} восстановил вам <b><red>${finalAmount}</red></b> маны.`;
        } else if (heal.source.gender === 'female') {
          buf = `${source} восстановила вам <b><red>${finalAmount}</red></b> маны.`;
        } else if (heal.source.gender === 'plural') {
          buf = `${source} восстановили вам <b><red>${finalAmount}</red></b> маны.`;
        } else {
          buf = `${source} восстановило вам <b><red>${finalAmount}</red></b> маны.`;
        }
      } else {
        if (heal.source.gender === 'male') {
          buf = `${source} восстановил вам параметр ${heal.attribute} (<b>${finalAmount}</b> единиц).`;
        } else if (heal.source.gender === 'female') {
          buf = `${source} восстановила вам параметр ${heal.attribute} (<b>${finalAmount}</b> единиц).`;
        } else if (heal.source.gender === 'plural') {
          buf = `${source} восстановили вам параметр ${heal.attribute} (<b>${finalAmount}</b> единиц).`;
        } else {
          buf = `${source} восстановило вам параметр ${heal.attribute} (<b>${finalAmount}</b> единиц).`;
        }
      }
      B.sayAt(this, buf);

      // show heal to party members only if it's to health and not restoring a different pool
      if (!this.party || heal.attribute !== 'health') {
        return;
      }

      for (const member of this.party) {
        if (member === this || member.room !== this.room) {
          continue;
        }

        let buf = `${source}${attacker} вылечило ${this.dname} <b><red>${finalAmount}</red></b>.`;
        B.sayAt(member, buf);
      }
    },

    /**
     * Player was killed
     * @param {Character} killer
     */
     killed: state => {
       const startingRoomRef = Config.get('startingRoom');
       if (!startingRoomRef) {
         Logger.error('No startingRoom defined in ranvier.json');
       }

       return function (killer) {
        this.removePrompt('combat');

        let othersDeathMessage = '';

        if (this.gender === 'male') {
          othersDeathMessage = killer ?
            `<b><red>${this.name} повалился на землю, убитый ${killer.tname}.</b></red>` :
            `<b><red>${this.name} повалился на землю замертво.</b></red>`;
        }  else if (this.gender === 'female') {
          othersDeathMessage = killer ?
            `<b><red>${this.name} повалилась на землю, убитая ${killer.tname}.</b></red>` :
            `<b><red>${this.name} повалилась на землю замертво.</b></red>`;
        } else if (this.gender === 'plural') {
          othersDeathMessage = killer ?
            `<b><red>${this.name} повалились на землю, убитые ${killer.tname}.</b></red>` :
            `<b><red>${this.name} повалились на землю замертво.</b></red>`;
        } else {
          othersDeathMessage = killer ?
            `<b><red>${this.name} повалилось на землю, убитое ${killer.tname}.</b></red>` :
            `<b><red>${this.name} повалилось на землю замертво.</b></red>`;
        }

        B.sayAtExcept(this.room, othersDeathMessage, (killer ? [killer, this] : this));

        if (this.party) {
          if (this.gender === 'male') {
            B.sayAt(this.party, `<b><green>${this.name} был убит!</green></b>`);
          } else if (this.gender === 'female') {
            B.sayAt(this.party, `<b><green>${this.name} была убита!</green></b>`);
          } else if (this.gender === 'plural') {
            B.sayAt(this.party, `<b><green>${this.name} были убиты!</green></b>`);
          } else {
            B.sayAt(this.party, `<b><green>${this.name} было убито!</green></b>`);
          }
        }

        this.setAttributeToMax('health');
        this.setAttributeToMax('mana');
        let helthDamaged = Math.floor(this.getMaxAttribute('health')*0.8);
        let manaDamaged = Math.floor(this.getMaxAttribute('mana')*0.8);
        this.lowerAttribute('health', helthDamaged);
        this.lowerAttribute('mana', manaDamaged);

        let home = state.RoomManager.getRoom(this.getMeta('home'));
        if (!home) {
          home = state.RoomManager.getRoom(startingRoomRef);
        }

        this.moveTo(home, _ => {
          state.CommandManager.get('look').execute(null, this);

          B.sayAt(this, '<b><red>Ой, вот незадача!</red></b>');
          if (killer && killer !== this) {
            B.sayAt(this, `Вы были убиты ${killer.tname}.`);
          }
          // player loses 20% exp gained this level on death
          const lostExp = Math.floor(this.experience * 0.2);
          this.experience -= lostExp;
          this.save();
          B.sayAt(this, `<red>Вы потеряли <b>${lostExp}</b> опыта!</red>`);

          B.prompt(this);
          state.CommandManager.get('look').execute('', this);

          const effect = state.EffectFactory.create('deathgloom', {}, {quantity: this.level});
          this.addEffect(effect);
          state.CommandManager.get('quit').execute('', this);
        });
      };
    },

    /**
     * Player killed a target
     * @param {Character} target
     */
    deathblow: state => function (target, skipParty) {
      const xp = LevelUtil.mobExp(target.level);
      if (this.party && !skipParty) {
        // if they're in a party proxy the deathblow to all members of the party in the same room.
        // this will make sure party members get quest credit trigger anything else listening for deathblow
        for (const member of this.party) {
          if (member.room === this.room) {
            member.emit('deathblow', target, true);
          }
        }
        return;
      }

      if (target && !this.isNpc) {
        B.sayAt(this, `<b><red>Вы убили ${target.vname}!</red></b>`);
      }

      this.emit('experience', xp);
    }
  }
};

function promptBuilder(promptee) {
  if (!promptee.isInCombat()) {
    return '';
  }

  // Set up some constants for formatting the health bars
  const playerName = "Вы";
  const targetNameLengths = [...promptee.combatants].map(t => t.name.length);
  const nameWidth = Math.max(playerName.length, ...targetNameLengths);
  const progWidth = 60 - (nameWidth + ':  ').length;

  // Set up helper functions for health-bar-building.
  const getHealthPercentage = entity => Math.floor((entity.getAttribute('health') / entity.getMaxAttribute('health')) * 100);
  const formatProgressBar = (name, progress, entity) => {
    const pad = B.line(nameWidth - name.length, ' ');
    return `<b>${name}${pad}</b>: ${progress} <b>${entity.getAttribute('health')}/${entity.getMaxAttribute('health')}</b>`;
  }

  // Build player health bar.
  let currentPerc = getHealthPercentage(promptee);
  let progress = B.progress(progWidth, currentPerc, "green");
  let buf = formatProgressBar(playerName, progress, promptee);

  // Build and add target health bars.
  for (const target of promptee.combatants) {
    let currentPerc = Math.floor((target.getAttribute('health') / target.getMaxAttribute('health')) * 100);
    let progress = B.progress(progWidth, currentPerc, "red");
    buf += `\r\n${formatProgressBar(target.Name, progress, target)}`;
  }

  return buf;
}
