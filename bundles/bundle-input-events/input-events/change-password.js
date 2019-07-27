'use strict';

const { EventUtil } = require('ranvier');

/**
 * Change password event
 */
module.exports = {
  event: state => (socket, args) => {
    const say = EventUtil.genSay(socket);
    const write = EventUtil.genWrite(socket);

    say("В вашем пароле должно быть как минимум 8 символов.");
    write('<cyan>Введите пароль для вашего аккаунта:</cyan> ');

    socket.command('toggleEcho');
    socket.once('data', pass => {
      socket.command('toggleEcho');
      say('');

      pass = pass.toString().trim();

      if (!pass) {
        say('Вы должны использовать пароль.');
        return socket.emit('change-password', socket, args);
      }

      if (pass.length < 8) {
        say('Ваш пароль недостаточно длинный.');
        return socket.emit('change-password', socket, args);
      }

      // setPassword handles hashing
      args.account.setPassword(pass);
      state.AccountManager.addAccount(args.account);
      args.account.save();

      socket.emit('confirm-password', socket, args);
    });
  }
};
