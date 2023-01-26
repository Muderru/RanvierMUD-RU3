const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'конфиг <установить/список> [настройки] [значение]',
  aliases: ['настройки', 'опции', 'конфиг', 'режим'],
  command: (state) => (args, player) => {
    const config ={
      "краткий": {type: "bulean"},
      "автосбор": {type: "bulean"},
      "миникарта": {type: "bulean"},
      "магсимвол": {type: "char"},
    };
    if (!args.length) {
      B.sayAt(player, 'Настроить что?');
      B.sayAt(player, 'Текущие настройки:');
      for (const key in player.metadata.config) {
        let setingType =config[key].type;
        let val = '';

        if (setingType == 'bulean') {
          val = player.metadata.config[key] ? 'вкл' : 'выкл';
        } else {
  val = player.metadata.config[key];
        }
        B.sayAt(player, `  ${key}: ${val}`);
      }
	  return;
  }
    let configToSet;
    let [arg1, valueToSet] = args.split(' ');
    
    for (let seting in config) {
      if (seting.startsWith(arg1)) {
        configToSet =seting;
        break;
      }
    }

    if (!configToSet) {
      B.sayAt(player, `<red>Недопустимые настройки: ${arg1}. </red>`);
      return;
    }
    const setingType =config[configToSet].type;
    if (setingType != "bulean" && !valueToSet) {
      B.sayAt(player, `<red>Какое значение вы хотите установить для ${configToSet}?</red>`);
      return;
    }
    if (setingType == "bulean") {
      const currentValue =player.getMeta(`config.${configToSet}`);
      valueToSet =currentValue ? false : true;
    }
    if (setingType == "char" && valueToSet.length > 1) {
      return B.sayAt(player, '<red>Символ должен быть только один.</red>');
    }

    if (!player.getMeta('config')) {
      player.setMeta('config', {});
    }

      player.setMeta(`config.${configToSet}`, valueToSet);
      let val = '';
      if (setingType == 'bulean') {
        val = player.metadata.config[configToSet] ? 'вкл' : 'выкл';
      } else {
        val = player.metadata.config[configToSet];
      }
      B.sayAt(player, `  ${configToSet}: ${val}`);
      B.sayAt(player, 'Настройки сохранены.');
    return;
  },
};
