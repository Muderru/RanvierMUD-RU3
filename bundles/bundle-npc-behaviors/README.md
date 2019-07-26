This bundle is a set of useful NPC behaviors.

## `ranvier-aggro`

A simple behavior to make an NPC aggressive. Aggressive is defined as attacking after some delay
when a player or NPC enters the room. An aggressive NPC will only fixate their attention on one
target at a time and not when they're already distracted by combat.
Options:

* `delay`: `number`, seconds after a character enters the room before attacking. Default: 5
* `warnMessage`: string, Message to send to players warning them that the mob will attack soon.  Message supports `%name%`
  token to place NPC name in message. Message is sent when half of the delay has passed.  Default '%name% growls,
warning you away.'
* `attackMessage`: `string`, Message to send to players when the mob moves to attack.  Message supports `%name%` token
  to place NPC name in message.  Default '%name% attacks you!'
* `towards`:
* * `players`: `boolean`, whether the NPC is aggressive towards players. Default: true
* * `npcs`: Array<EntityReference>, list of NPC entityReferences which this NPC will attack on sight
 
Example:

```yaml 
      # an NPC that's aggressive towards players
      behaviors:
        ranvier-aggro:
          delay: 10
          warnMessage: '%name% snarls angrily.'
          towards:
            players: true
            npcs: false
 
      # an NPC that fights enemy NPC squirrels and rabbits
      behaviors:
        ranvier-aggro:
           towards:
             players: false
             npcs: ["limbo:squirrel", "limbo:rabbit"]
```

## `ranvier-wander`

An example behavior that causes an NPC to wander around an area when not in combat
Options:

* `areaRestricted`: `boolean`, true to restrict the NPC's wandering to his home area. Default: false
* `restrictTo`: `Array<EntityReference>`, list of room entity references to restrict the NPC to. For example if you want
  them to wander along a set path
  `interval`: `number`, delay in seconds between room movements. Default: 20
