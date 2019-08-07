'use strict';

/**
 * See warrior.js for more on classes.
 */
module.exports = {
  name: 'Маг',
  description: 'Маги посвящают многие годы изучению тайных сил и их влиянию на мир. Они не привыкли полагаться на грубую силу. Чтобы выжить в этом враждебном мире, они используют разрушительные заклинания, пока им хватает маны.',
  abilityTable: {},

  setupPlayer: (state, player) => {
    const mana = state.AttributeFactory.create('mana', 100);
    player.addAttribute(mana);
    player.prompt = '[ %health.current%/%health.max% <b>жизни</b> %mana.current%/%mana.max% <b>энергии</b> ]';
  }
};
