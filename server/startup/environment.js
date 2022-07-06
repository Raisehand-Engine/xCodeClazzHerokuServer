const _ = require('lodash');

function notFound(value, key) {
    if (_.isUndefined(value)) throw new Error(`FATAL ERROR: ${key} not found!`);
}

// this file is responsible for letting user know which env variable not found!
module.exports = function () {
    // notFound(process.env.saltIterator, 'saltIterator');
    // ...
};