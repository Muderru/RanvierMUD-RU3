const { Broadcast: B, Logger } = require('ranvier');

/**
 * A simple behavior to make an NPC aggressive. Aggressive is defined as attacking after some delay
 * when a player or NPC enters the room. An aggressive NPC will only fixate their attention on one
 * target at a time and not when they're already distracted by combat.
 * Options:
 *   delay: number, seconds after a character enters the room before attacking. Default: 5
 *   warnMessage: string, Message to send to players warning them that the mob will attack soon.
 *     Message supports `%name%` token to place NPC name in message. Message is sent when half of
 *     the delay has passed.
 *     Default '%name% growls, warning you away.'
 *   attackMessage: string, Message to send to players when the mob moves to attack.
 *     Message supports `%name%` token to place NPC name in message.
 *     Default '%name% attacks you!'
 *   towards:
 *     players: boolean, whether the NPC is aggressive towards players. Default: true
 *     npcs: Array<EntityReference>, list of NPC entityReferences which this NPC will attack on sight
 *
 * Example:
 *
 *     # an NPC that's aggressive towards players
 *     behaviors:
 *       ranvier-aggro:
 *         delay: 10
 *         warnMessage: '%name% snarls angrily.'
 *         towards:
 *           players: true
 *           npcs: false
 *
 *     # an NPC that fights enemy NPC squirrels and rabbits
 *     behaviors:
 *       ranvier-aggro:
 *          towards:
 *            players: false
 *            npcs: ["limbo:squirrel", "limbo:rabbit"]
 */
module.exports = {
  listeners: {
    updateTick: (state) => function (config) {
      const playersCount = state.PlayerManager.players.size;
      if (playersCount === 0) {
        return;
      }

      if (!this.room) {
        return;
      }

      if (this.hasAttribute('freedom') && this.getAttribute('freedom') < 0) {
        return;
      }

      if (typeof config !== 'object') {
        config = {};
      }

      // setup default configs
      config = {
        delay: 5,
        warnMessage: '%name% угрожающе рычит.',
        attackMessage: '%name% нападает на вас!',
        towards: {
          players: true,
          npcs: false,
        },
        ...config,
      };

      if (this.isInCombat()) {
        return;
      }

      if (this._aggroTarget) {
        if (this._aggroTarget.room !== this.room) {
          this._aggroTarget = null;
          this._aggroWarned = false;
          return;
        }

        let detectInvis = 0;
        let detectHide = 0;

        if (this.hasAttribute('detect_invisibility')) {
          detectInvis = this.getAttribute('detect_invisibility');
        }

        if (this.hasAttribute('detect_hide')) {
          detectHide = this.getAttribute('detect_hide');
        }

        if (this._aggroTarget.hasAttribute('invisibility') && this._aggroTarget.getAttribute('invisibility') > detectInvis) {
          this._aggroTarget = null;
          this._aggroWarned = false;
          return;
        } if (this._aggroTarget.hasAttribute('hide') && this._aggroTarget.getAttribute('hide') > detectHide) {
          this._aggroTarget = null;
          this._aggroWarned = false;
          return;
        }

        const sinceLastCheck = Date.now() - this._aggroTimer;
        const delayLength = config.delay * 1000;

        // attack
        if (sinceLastCheck >= delayLength) {
          if (!this._aggroTarget.isNpc) {
            B.sayAt(this._aggroTarget, config.attackMessage.replace(/%name%/, this.Name));
          } else {
            Logger.verbose(`NPC [${this.uuid}/${this.entityReference}] attacks NPC [${this._aggroTarget.uuid}/${this._aggroTarget.entityReference}] in room ${this.room.entityReference}.`);
          }
          this.initiateCombat(this._aggroTarget);
          this._aggroTarget = null;
          this._aggroWarned = false;
          return;
        }

        // warn
        if (sinceLastCheck >= delayLength / 2 && !this._aggroTarget.isNpc && !this._aggroWarned) {
          B.sayAt(this._aggroTarget, config.warnMessage.replace(/%name%/, this.Name));
          this._aggroWarned = true;
        }

        return;
      }

      // try to find a player to be aggressive towards first
      if (config.towards.players && this.room.players.size) {
        this._aggroTarget = [...this.room.players][Math.floor(Math.random() * this.room.players.size)];
        this._aggroTimer = Date.now();
        return;
      }

      if (config.towards.npcs && this.room.npcs.size) {
        for (const npc of this.room.npcs) {
          if (npc === this) {
            continue;
          }

          if (
            config.towards.npcs === true
            || (Array.isArray(config.towards.npcs) && config.towards.npcs.includes(npc.entityReference))
          ) {
            this._aggroTarget = npc;
            this._aggroTimer = Date.now();
            return;
          }
        }
      }
    },
  },
};
