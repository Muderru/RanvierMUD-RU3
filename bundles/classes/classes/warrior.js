/**
 * This example definition of a class file is a guideline. The class system is
 * left intentionally vague so as to not be too opinionated. Class files are
 * assumed to be js files instead of blank yaml files just to future proof the
 * bundle-loading of class files in case someone wants extra functionality in
 * their classes.
 */
module.exports = {
  name: 'Воин',
  description: 'Воины непревзойденные мастера в владении оружием. Топоры, мечи или булавы, им все равно чем крушить врага. Действуя немного прямолинейно, они полагатся в первую очередь на свою силу и упорство. При повышении уровня получают с вероятностью в 80% - очки умений и 20% - очки магии.',

  abilityTable: {},

  setupPlayer: (state, player) => {
    player.prompt = '[ %health.current%/%health.max% <b>жизни</b> %mana.current%/%mana.max% <b>энергии</b> ]';
  },
};
