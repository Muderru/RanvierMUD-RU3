'use strict';

const humanize = (sec) => { return require('humanize-duration')(sec, { language: 'ru', round: true }); };
const { Broadcast: B, Logger, SkillErrors } = require('ranvier');
const Combat = require('../combat/lib/Combat');
const CombatErrors = require('../combat/lib/CombatErrors');
const { Random } = require('rando-js');

module.exports = {
  listeners: {
    useAbility: state => function (ability, args) {
      let skillname = 'skill_' + ability.id;

      if (!this.getMeta(skillname)) {
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
            target = Combat.findCombatant(this, targetSearch);
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
          return B.sayAt(this, `${ability.name} на задержке. ${humanize(e.effect.remaining)} осталось.`);
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
      let increment = 0;
      increment += this.getBaseAttribute('stamina'); // or however much you want it to go up on leveling

      if (hp) {
          hp.setBase(hp.base + increment);
      }

      B.sayAt(this, '<b><cyan>Вы получили ' + increment + ' жизни.</cyan></b>');

      if (this.hasAttribute('mana')) {
          let mana = this.attributes.get('mana');
          let mana_add = 0;
          mana_add += this.getBaseAttribute('intellect');
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
