const _ = require('lodash');
const {mongoose} = require('../connections/database');
const RESPONSE = require('../classes/RESPONSER');
const Utils = require('../helper/utils');
const bcrypt = require('bcryptjs');

const not = o => !o;

// [Tested] [Indirectly]
function valuesHasNoError(params = [], cb) {
  let fine = 0;
  let totalParams = params.length;
  for (let i = 0; i < totalParams; i++)
    notUndefinedAndNull(params[i], () => (fine += 1));
  const result = fine !== totalParams - 1;
  return result ? cb() : false;
}

// [Tested] [Indirectly]
function notUndefinedAndNullAndEmptyPromise(param) {
  return new Promise(resolve => !_.isUndefined(param) && !_.isNull(param) && !_.isEmpty(param) ? resolve(true) : resolve(false));
}

// [Tested] [Indirectly]
function notUndefinedAndNullPromise(param) {
  return new Promise(resolve => !_.isUndefined(param) && !_.isNull(param) ? resolve(true) : resolve(false));
}

// [Tested] [Indirectly]
function notUndefinedAndNull(param, cb) {
  return !_.isUndefined(param) && !_.isNull(param) ? cb() : false;
}

// [Tested]
function everyElementShouldBeMongoId(array) {
  return notUndefinedAndNull(array, () => {
    if (not(Array.isArray(array))) return false;

    const bools = _.map(array, mongoose.Types.ObjectId.isValid);
    if (bools.length == 0) return false;

    const isCorrect = _.includes(bools, false);
    return !isCorrect;
  });
}

// [Tested]
function everyElementShouldBeNumber(array) {
  return notUndefinedAndNull(array, () => {
    if (not(Array.isArray(array))) return false;

    const bools = _.map(array, (v) => typeof v == 'number');
    if (bools.length == 0) return false;

    const isCorrect = _.includes(bools, false);
    return !isCorrect;
  });
}

// [Not Tested]
function parseEveryElementAndShouldBeNumber(array) {
  return notUndefinedAndNull(array, () => {
    if (not(Array.isArray(array))) return false;

    const bools = _.map(array, (v) => parseInt(v) !== NaN);
    if (bools.length == 0) return false;

    const isCorrect = _.includes(bools, false);
    return !isCorrect;
  });
}

// [Tested]
function elementShouldBeNumber(value) {
  return notUndefinedAndNull(value, () => typeof value == 'number');
}

// [Tested]
function everyElementShouldBeString(array) {
  return notUndefinedAndNull(array, () => {
    if (not(Array.isArray(array))) return false;

    const bools = _.map(array, (v) => typeof v == 'string');
    if (bools.length == 0) return false;

    const isCorrect = _.includes(bools, false);
    return !isCorrect;
  });
}

// [Tested]
function stringLengthShouldBeMoreThenZero(value) {
  return notUndefinedAndNull(value, () => {
    if (typeof value != 'string') return false;
    return value.length > 0;
  });
}

// [Tested]
function stringLengthShouldBeMoreThen(value, than) {
  return valuesHasNoError([value, than], () => {
    if (typeof value != 'string') return false;
    return value.length > parseInt(than);
  });
}

// [Tested]
function stringLengthShouldBeLessThen(value, than) {
  return valuesHasNoError([value, than], () => {
    if (typeof value != 'string') return false;
    return value.length < parseInt(than);
  });
}

// [Tested] [Indirectly]
function compareBcryptPassword(rawPassword, hashedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(rawPassword, hashedPassword, function (error, Matched) {
      if (error) resolve(error);
      else resolve(Matched);
    });
  });
}

// [Tested]
function everyElementShouldBeObject(array) {
  return notUndefinedAndNull(array, () => {
    if (not(Array.isArray(array))) return false;

    const bools = _.map(array, (v) => _.isObjectLike(v));
    if (bools.length == 0) return false;

    const isCorrect = _.includes(bools, false);
    return !isCorrect;
  });
}

// [Tested]
function hasAccessToThisRepository(
  repoAccessPasscodeArray,
  pr_id,
  productRepositoryProfilePassword
) {
  return valuesHasNoError(
    [repoAccessPasscodeArray, pr_id, productRepositoryProfilePassword],
    () => {
      if (not(Array.isArray(repoAccessPasscodeArray))) return false;

      if (not(mongoose.Types.ObjectId.isValid(pr_id))) return false;
      if (typeof repoAccessPasscodeArray.id === 'undefined') return false;

      const repo = repoAccessPasscodeArray.id(pr_id); // since this is schema, it will have id() function, in it's prototype
      return notUndefinedAndNull(
        repo,
        () =>
          repo.productRepositoryProfilePassword ===
          productRepositoryProfilePassword
      );
    }
  );
}

// [Tested]
function isValidBarcode(barcode) {
  return notUndefinedAndNull(barcode, () => {
    if (_.isString(barcode) && parseInt(barcode) > 0) {
      if (barcode.length > 10 && barcode.length < 15) {
        const prefix = barcode.substr(0, 3);
        return (parseInt(prefix) === 890);
      } else return false;
    } else return false;
  });
}

async function notUN(fieldName, value, res) {
  let fine = await notUndefinedAndNullPromise(value);
  if (not(fine)) return new RESPONSE(res).bad(Utils.errBody(`Something is not right, '${fieldName}' has bog down`));
}

async function notUNE(fieldName, value, res) {
  let fine = await notUndefinedAndNullAndEmptyPromise(value);
  if (not(fine)) return new RESPONSE(res).bad(Utils.errBody(`Something is not right, '${fieldName}' has bog down`));
}

function isValidUrl(url = ''){
  // return /((ftp|https?):\/\/)?(www\.)?[a-z0-9\-\.]{3,}\.[a-z]{3}$/.test(learnRegExp.arguments[0]);
  return /((ftp|https?):\/\/)?(www\.)?[a-z0-9\-\.]{3,}\.[a-z]{3}$/.test(url);
}

module.exports = {
  elementShouldBeNumber,
  stringLengthShouldBeMoreThenZero,
  stringLengthShouldBeMoreThen,
  stringLengthShouldBeLessThen,
  everyElementShouldBeMongoId,
  everyElementShouldBeNumber,
  everyElementShouldBeString,
  everyElementShouldBeObject,
  hasAccessToThisRepository,
  notUndefinedAndNullAndEmptyPromise,
  parseEveryElementAndShouldBeNumber,
  notUndefinedAndNullPromise,
  compareBcryptPassword,
  notUndefinedAndNull,
  valuesHasNoError,
  isValidUrl,
  notUNE,
  notUN,
  isValidBarcode,
};
