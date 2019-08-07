'use strict';

module.exports = {
  name: 'Паладин',
  description: 'Эти фанатики не так сильны в бою, как воины, но их связь с высшими силами позволяет им помогать и усиливать их товарищей. Они способны излечивать раны и накладывать мощные усиления на членов группы.',

  abilityTable: {},

  setupPlayer: (state, player) => {
    const mana = state.AttributeFactory.create('mana', 100);
    player.addAttribute(mana);
    player.prompt = '[ %health.current%/%health.max% <b>жизни</b> %mana.current%/%mana.max% <b>энергии</b> ]';
  }
};
