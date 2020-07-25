const Ranvier = require('ranvier');

const { Broadcast } = Ranvier;

module.exports = {
  aliases: ['пвп', 'пк'],
  command: (state) => (args, player) => {
    const previousPvpSetting = player.getMeta('pvp') || false;
    const newPvpSetting = !previousPvpSetting;
    player.setMeta('pvp', newPvpSetting);

    const message = newPvpSetting
      ? 'Теперь вы можете сражаться с другими игроками.'
      : 'Теперь вы пацифист и не можете сражаться с другими игроками.';
    Broadcast.sayAt(player, message);
  },
};
