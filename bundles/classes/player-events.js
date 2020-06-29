'use strict';

const humanize = (sec) => { return require('humanize-duration')(sec, { language: 'ru', round: true }); };
const { Broadcast: B, Logger, SkillErrors } = require('ranvier');
const Combat = require('../combat/lib/Combat');
const CombatErrors = require('../combat/lib/CombatErrors');
const { Random } = require('rando-js');
const ArgParser = require('../lib/lib/ArgParser');
const dot = ArgParser.parseDot;

module.exports = {
  listeners: {
    useAbility: state => function (ability, args) {
      let skillname = 'skill_' + ability.id;
      let spellname = 'spell_' + ability.id;

      if (!this.getMeta(skillname) && !this.getMeta(spellname)) {
          return B.sayAt(this, 'Вы еще не выучили эту способность.');
      }

      let target = null;
      if (ability.requiresTarget) {
        if (!args || !args.length) {
          if (ability.targetSelf) {
            target = this;
          } else if (this.isInCombat()) {
            target = [...this.combatants][0];
          } else {
            target = null;
          }
        } else {
          try {
            const targetSearch = args.split(' ').pop();
            target = dot(targetSearch, this.room.players);
            if (!target) {
              target = dot(targetSearch, this.room.npcs);
            }
            if (target && target.hasAttribute('invisibility') && target.getAttribute('invisibility') > this.getAttribute('detect_invisibility')) {
              return B.sayAt(this, `Использовать способность ${ability.name} на ком?`);
            }
            if (target && target.hasAttribute('hide') && target.getAttribute('hide') > this.getAttribute('detect_hide')) {
              return B.sayAt(this, `Использовать способность ${ability.name} на ком?`);
            }
          } catch (e) {
            if (
              e instanceof CombatErrors.CombatSelfError ||
              e instanceof CombatErrors.CombatNonPvpError ||
              e instanceof CombatErrors.CombatInvalidTargetError ||
              e instanceof CombatErrors.CombatPacifistError
            ) {
              return B.sayAt(this, e.message);
            }

            Logger.error(e.message);
          }
        }

        if (!target) {
          return B.sayAt(this, `Использовать способность ${ability.name} на ком?`);
        }
      }

      try {
        ability.execute(args, this, target);
      } catch (e) {
        if (e instanceof SkillErrors.CooldownError) {
          if (ability.cooldownGroup) {
            return B.sayAt(this, `Нельзя использовать способность ${ability.name} пока действует задержка ${e.effect.skill.name}.`);
          }
          return B.sayAt(this, `Вы еще не можете использовать \'${ability.name}\'. ${humanize(e.effect.remaining)} осталось.`);
        }

        if (e instanceof SkillErrors.PassiveError) {
          return B.sayAt(this, `Это пассивное умение.`);
        }

        if (e instanceof SkillErrors.NotEnoughResourcesError) {
          return B.sayAt(this, `Недостаточно энергии.`);
        }

        Logger.error(e.message);
        B.sayAt(this, 'Как?');
      }
    },

    /**
     * Handle player leveling up
     */
    level: state => function () {
      const abilities = this.playerClass.abilityTable;

      const attributePoints = this.getMeta('attributePoints');
      const magicPoints = this.getMeta('magicPoints');
      const skillPoints = this.getMeta('skillPoints');
      const hp = this.attributes.get('health');
      const increment = 20; //столько получаем единиц жизни при повышении уровня

      if (hp) {
          hp.setBase(hp.base + increment);
      }

      B.sayAt(this, '<b><cyan>Вы получили ' + increment + ' жизни.</cyan></b>');

      if (this.hasAttribute('mana')) {
          let mana = this.attributes.get('mana');
          const mana_add = 20; //столько получаем единиц маны при повышении уровня
          mana.setBase(mana.base + mana_add);
          B.sayAt(this, '<b><cyan>Вы получили ' + mana_add + ' маны.</cyan></b>');
      }

      this.setMeta('attributePoints', attributePoints + 1);

      switch (this.playerClass.id) {
        case 'warrior':
          if (Random.inRange(0, 100) <=80) {
              this.setMeta('skillPoints', skillPoints + 1);
              B.sayAt(this, '<b><cyan>Вы получили 1 очко характеристик и 1 очко умений.</cyan></b>');
          } else {
              this.setMeta('magicPoints', magicPoints + 1);
              B.sayAt(this, '<b><cyan>Вы получили 1 очко характеристик и 1 очко магии.</cyan></b>');
          }
        break;
        case 'mage':
          if (Random.inRange(0, 100) <=80) {
              this.setMeta('magicPoints', magicPoints + 1);
              B.sayAt(this, '<b><cyan>Вы получили 1 очко характеристик и 1 очко магии.</cyan></b>');
          } else {
              this.setMeta('skillPoints', skillPoints + 1);
              B.sayAt(this, '<b><cyan>Вы получили 1 очко характеристик и 1 очко умений.</cyan></b>');
          }
        break;
        case 'paladin':
          if (Random.inRange(0, 100) < 50) {
              this.setMeta('magicPoints', magicPoints + 1);
              B.sayAt(this, '<b><cyan>Вы получили 1 очко характеристик и 1 очко магии.</cyan></b>');
          } else {
              this.setMeta('skillPoints', skillPoints + 1);
              B.sayAt(this, '<b><cyan>Вы получили 1 очко характеристик и 1 очко умений.</cyan></b>');
          }
        break;
        default:
          B.sayAt(this, `<bold><red>Произошла какая-то ошибка при добавлении очков умений и заклинаний.</red></bold>`);
        break;
    }
    }
  }
};
