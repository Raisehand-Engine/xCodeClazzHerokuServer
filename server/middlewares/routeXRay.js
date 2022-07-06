const {routeXRay} = require('./functions');
module.exports = (req, res, next) => routeXRay(req, res, next);