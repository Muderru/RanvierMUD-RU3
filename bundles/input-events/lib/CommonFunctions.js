'use strict';

/**
 * General functions used on the ranvier-input-events bundle
 */

const { Config } = require('ranvier');

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
    return 'Слишком длинное, попробуйте имя покороче.';
  }
  if (name.length < minLength) {
    return 'Слишком коротко, попробуйте имя подлиннее.';
  }
  if (!/^[а-я]+$/i.test(name)) {
    return 'Ваше имя должно содержать только русские буквы без пробелов или специальных символов.';
  }
  return false;
};
