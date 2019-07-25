'use strict';

module.exports = srcPath => {
  return {
    name: 'Паладин',
    description: 'Эти фанатики не так сильны в бою, как воины, но их связь с высшими силами позволяет им помогать и усиливать их товарищей. Они способны излечивать раны и накладывать мощные усиления на членов группы.',

    abilityTable: {
      3: { skills: ['осуждение'] },
      5: { skills: ['милость_света'] },
      7: { skills: ['сокрушить'] },
    },

    setupPlayer: player => {
      // Paladins use Favor, with a max of 10. Favor is a generated resource and returns to 0 when out of combat
      player.addAttribute('favor', 10, -10);
      player.prompt = '[ <red><b>%health.current%/%health.max% хп</b></red> <b><yellow>%favor.current%/%favor.max% воля</yellow></b> ]';
    }
  };
};
