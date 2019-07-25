'use strict';

/**
 * This example definition of a class file is a guideline. The class system is
 * left intentionally vague so as to not be too opinionated. Class files are
 * assumed to be js files instead of blank yaml files just to future proof the
 * bundle-loading of class files in case someone wants extra functionality in
 * their classes.
 */
module.exports = srcPath => {
  return {
    name: 'Воин',
    description: 'Воины непревзойденные мастера в владении оружием. Топоры, мечи или булавы, им все равно чем крушить врага. Действуя немного прямолинейно, они полагатся в первую очередь на свою силу и упорство.',

    abilityTable: {
      3: { skills: ['рваная_рана'] },
      5: { skills: ['выпад'] },
      7: { skills: ['блокирование_щитом'] },
     10: { skills: ['второе_дыхание'] },
    },

    setupPlayer: player => {
      player.addAttribute('energy', 100);
      player.prompt = '[ <red><b>%health.current%/%health.max% хп</b></red> <green>%energy.current%/%energy.max% бодрость</green> ]';
    }
  };
};
