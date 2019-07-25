'use strict';
const Combat = require('./lib/Combat');
const CombatErrors = require('./lib/CombatErrors');
const LevelUtil = require('../ranvier-lib/lib/LevelUtil');
const WebsocketStream = require('../ranvier-websocket/lib/WebsocketStream');
const DamageType = require('./lib/DamageType');

/**
 * Auto combat module
 */
module.exports = (srcPath) => {
  const B = require(srcPath + 'Broadcast');

  return  {
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

      currency: state => function (currency, amount) {
          const friendlyName = currency.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          const key = `currencies.${currency}`;

          if (!this.getMeta('currencies')) {
            this.setMeta('currencies', {});
          }
          this.setMeta(key, (this.getMeta(key) || 0) + amount);
          this.save();

          B.sayAt(this, `<green>Вы получили деньги: <b><white>[${friendlyName}]</white></b> x${amount}.`);
      },

      /**
       * When the player hits a target
       * @param {Damage} damage
       * @param {Character} target
       */
      hit: state => function (damage, target) {
        if (damage.hidden) {
          return;
        }

        let buf = '';
        if (damage.source) {
            if (damage.source.gender === 'male') {
              buf = `Ваш <b>${damage.source.name}</b> ударил`;
            } else if (damage.source.gender === 'female') {
              buf = `Ваша <b>${damage.source.name}</b> ударила`;
            } else if (damage.source.gender === 'plural') {
              buf = `Ваши <b>${damage.source.name}</b> ударили`;
            } else {
              buf = `Ваше <b>${damage.source.name}</b> ударило`;
            }
        } else {
          buf = "Вы ударили";
        }

        buf += ` <b>${target.vname}</b> на <b>${damage.finalAmount}</b> урона.`;

        if (damage.critical) {
          buf += ' <red><b>(Критический удар)</b></red>';
        }

        B.sayAt(this, buf);

        if (this.equipment.has('правая рука')) {
          this.equipment.get('правая рука').emit('hit', damage, target);
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
          if (damage.source) {
            if (damage.source.gender === 'male') {
              buf = `<b>${damage.source.name}</b> ${this.rname} ударил`;
            } else if (damage.source.gender === 'female') {
              buf = `<b>${damage.source.name}</b> ${this.rname} ударила`;
            } else if (damage.source.gender === 'plural') {
              buf = `<b>${damage.source.name}</b> ${this.rname} ударили`;
            } else {
              buf = `<b>${damage.source.name}</b> ${this.rname} ударило`;
            }              
          } else {
            if (this.gender === 'male') {
              buf = `${this.name} ударил`;
            } else if (this.gender === 'female') {
              buf = `${this.name} ударила`;
            } else if (this.gender === 'plural') {
              buf = `${this.name} ударили`;
            } else {
              buf = `${this.name} ударило`;
            }              
          }

          buf += ` <b>${target.vname}</b> на <b>${damage.finalAmount}</b> урона.`;
          B.sayAt(member, buf);
        }
      },

      /**
       * @param {Heal} heal
       * @param {Character} target
       */
      heal: state => function (heal, target) {
        if (heal.hidden) {
          return;
        }

        if (target !== this) {
          let buf = '';
          if (heal.source) {
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

          buf += `<b> ${target.vname}</b> <b><green>${heal.finalAmount}</green></b> ${heal.attribute}.`;
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
          if (heal.source) {
            if (heal.source.gender === 'male') {
              buf = `<b>${heal.source.name}</b> ${this.rname} вылечил`;
            } else if (heal.source.gender === 'female') {
              buf = `<b>${heal.source.name}</b> ${this.rname} вылечила`;
            } else if (heal.source.gender === 'plural') {
              buf = `<b>${heal.source.name}</b> ${this.rname} вылечила`;
            } else {
              buf = `<b>${heal.source.name}</b> ${this.rname} вылечило`;
            }              
          } else {
            buf = `${this.name} вылечил`;
          }

          buf += ` <b>${target.vname}</b>`;
          buf += ` <b><green>${heal.finalAmount}</green></b> ${heal.attribute}.`;
          B.sayAt(member, buf);
        }
      },

      damaged: state => function (damage) {
        if (damage.hidden || damage.attribute !== 'health') {
          return;
        }

        if (this.getAttribute('health') <= 0 && damage.attacker) {
          this.combatData.killedBy = damage.attacker;
        }

        
        let buf = '';
        if (damage.attacker) {
          buf = `<b>${damage.attacker.name}</b>`;
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

        if (damage.source) {
          let source = damage.source.name;
          let isNpc = damage.attacker && damage.attacker.isNpc;
          if (isNpc) {
            const Skill = require(srcPath + 'Skill');
            const isSkill = damage.source instanceof Skill;
            if (!isSkill) {
              //TODO: get weapon first if exists.
              source = damage.attacker.metadata.attackVerb || '';
            }
          }

          buf += `<b>${source}</b>`;
        } else if (!damage.attacker) {
          buf += "Что-то";
        }


        if (damage.attacker) {
            buf += ` ${damage.attacker.damageVerb} <b>вас</b> на <b><red>${damage.finalAmount}</red></b> урона.`;
        } else {
            buf += ` <b>:</b> <b><red>${damage.finalAmount}</red></b> урона.`;
        }


        if (damage.critical) {
          buf += ' <red><b>(Критический удар)</b></red>';
        }

        B.sayAt(this, buf);

        // show damage to party members
        if (!this.party) {
          return;
        }

        for (const member of this.party) {
          if (member === this || member.room !== this.room) {
            continue;
          }

          let buf = '';
        if (damage.attacker) {
              if (damage.attacker.gender === 'male') {
                buf = `${damage.attacker.name} ударил`;
              } else if (damage.attacker.gender === 'female') {
                buf = `${damage.attacker.name} ударила`;
              } else if (damage.attacker.gender === 'plural') {
                buf = `${damage.attacker.name} ударили`;
              } else {
                buf = `${damage.attacker.name} ударило`;
              }            
           } else if (!damage.attacker) {
             buf = "Что-то ударило";
           }

          buf += ` <b>${this.vname}</b> на <b><red>${damage.finalAmount}</red></b> урона`;
          B.sayAt(member, buf);
        }
      },

      healed: state => function (heal) {
        if (heal.hidden) {
          return;
        }

        let buf = '';
        let attacker = '';
        let source = '';

        if (heal.attacker && heal.attacker !== this) {
          attacker = `<b>${heal.attacker.name}</b> `;
        }

        if (heal.source) {
          attacker = " " + `${attacker.rname}`;
          source = `<b>${heal.source.name}</b>`;
        } else if (!heal.attacker) {
          source = "Что-то";
        }

        if (heal.attribute === 'health') {
          buf = `${source}${attacker} вылечило вам <b><red>${heal.finalAmount}</red></b>.`;
        } else {
          buf = `${source}${attacker} восстановило вам <b>${heal.finalAmount}</b> ${heal.attribute}.`;
        }
        B.sayAt(this, buf);

        // show heal to party members only if it's to health and not restoring a different pool
        if (!this.party || heal.attribute !== 'health') {
          return;
        }

        for (const member of this.party) {
          if (member === this || member.room !== this.room || member === heal.attacker) {
            continue;
          }

          let buf = `${source}${attacker} вылечило ${this.dname} <b><red>${heal.finalAmount}</red></b>.`;
          B.sayAt(member, buf);
        }
      },

      /**
       * Player was killed
       * @param {Character} killer
       */
      killed: state => function (killer) {
        this.removePrompt('combat');
        var othersDeathMessage = '';

        if (this.gender === 'male') {
            othersDeathMessage = killer ?
            `<b><red>${this.name} повалился на землю, мертвый от рук ${killer.rname}.</b></red>` :
            `<b><red>${this.name} повалился на землю мертвый</b></red>`;
        } else if (this.gender === 'female') {
            othersDeathMessage = killer ?
            `<b><red>${this.name} повалилась на землю, мертвая от рук ${killer.rname}.</b></red>` :
            `<b><red>${this.name} повалилась на землю мертвая</b></red>`;
        } else if (this.gender === 'plural') {
            othersDeathMessage = killer ?
            `<b><red>${this.name} повалились на землю, мертвые от рук ${killer.rname}.</b></red>` :
            `<b><red>${this.name} повалились на землю мертвые</b></red>`;
        } else {
            othersDeathMessage = killer ?
            `<b><red>${this.name} повалилось на землю, мертвое от рук ${killer.rname}.</b></red>` :
            `<b><red>${this.name} повалилось на землю мертвое</b></red>`;
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

        let home = state.RoomManager.getRoom(this.getMeta('waypoint.home'));
        if (!home) {
          home = state.RoomManager.startingRoom;
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
        });
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
      buf += `\r\n${formatProgressBar(target.name, progress, target)}`;
    }

    return buf;
  }
};
