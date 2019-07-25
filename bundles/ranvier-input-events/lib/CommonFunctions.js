'use strict';

/**
 * General functions used on the ranvier-input-events bundle
 */

const srcPath = '../../../src/'
const Config  = require(srcPath + 'Config');

/**
 * @param {string} name
 * @return {boolean}
 */
exports.validateName = function(name) {
  const maxLength = Config.get('maxAccountNameLength');
  const minLength = Config.get('minAccountNameLength');

  if (!name) {
    return 'Пожалуйста, введите имя.';
  }
  if (name.length > maxLength) {
    return 'Слишком длинно, попробуйте короче.';
  }
  if (name.length < minLength) {
    return 'Слишком короткое, попробуйте длиннее.';
  }
  if (!/^[a-я]+$/i.test(name)) {
    return 'Ваше имя может содержать русские или английские буквы без пробелов или специальных символов.';
  }
  return false;
}
