/**
 * See warrior.js for more on classes.
 */
module.exports = {
  name: 'Маг',
  description: 'Маги посвящают многие годы изучению тайных сил и их влиянию на мир. Они не привыкли полагаться на грубую силу. Чтобы выжить в этом враждебном мире, они используют разрушительные заклинания, пока им хватает маны. При повышении уровня получают с вероятностью в 80% - очки магии и 20% - очки умений.',
  abilityTable: {},

  setupPlayer: (state, player) => {
    player.prompt = '[ %health.current%/%health.max% <b>жизни</b> %mana.current%/%mana.max% <b>энергии</b> ]';
  },
};
