const _ = require('lodash');
const winston = require('winston');
const Utils = require('../helper/utils');
const { User } = require('../models/User');
const { validationResult } = require('express-validator');

const ROLE = require('../static data/supported_roles');
const RESPONSE = require('../classes/RESPONSER');
const { hasRole } = require('../helper/validatorHelper');
const { versions } = require('../helper/versions');
const { header_keys, cookie_keys } = require('../models/_Constants');
const { PLATFORMS, APP_NAMES, middleware_strictness } = require('../models/_Constants');

const not = o => !o;

function formDataParser(req, res, next) {
  if (typeof (req.body) == 'string') req.body = JSON.parse(req.body);
  next();
}

async function maintenanceStateCheck(req, res, next) {
  const isMaintenanceStage = (process.env.MAINTENANCE == true || process.env.MAINTENANCE == 'true') || false;
  if (isMaintenanceStage === true) return new RESPONSE(res).serviceUnavailable(Utils.errBody('Server is under maintenance, Please wait for few minutes'));
  else next();
}

function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
}

const authenticationCheck = (strictness_level = middleware_strictness.dont_allow) => (req, res, next) => {
  const canSpoof = strictness_level.match(middleware_strictness.spoof_them);
  let token = req.cookies[cookie_keys.xcodeclazz_auth_token] || req.headers[header_keys.xcodeclazz_auth_token];

  if (not(token) && canSpoof == true) return new RESPONSE(res).ok({ message: 'You\'r not allow to perform action', isAuthenticated: false });
  if (not(token) && canSpoof == false) return new RESPONSE(res).unauthorized({ message: 'User was logged out', isAuthenticated: false });
  if (not(token)) return new RESPONSE(res).unauthorized({ message: 'User was logged out', isAuthenticated: false });

  User.findByToken(token, (error, user) => {
    if (error) return new RESPONSE(res).unauthorized(Utils.errBody('Please Re-logging'));
    if (not(user)) return new RESPONSE(res).unauthorized({ message: 'User was logged out', isAuthenticated: false });
    req.token = token;
    req.user = user;
    next();
  });
}

function routeDeprecated(req, res, next) {
  return new RESPONSE(res).upgradeRequired({ message: 'Please upgrade your application', error: true });
  // next(); <- not call this methods, because we want user to not go further in funnel
}

function winstonLogger(err, req, res, next) {
  winston.log(err.message, { err }); // error, warn, info, verbose, debug, silly
  return new RESPONSE(res).internalServerError(Utils.errBodyWithStack(err.message, err.stack));
}

function onlyDevelopmentEnv(req, res, next) {
  if (req.env === process.env.DEVELOPMENT) next();
  else return new RESPONSE(res).bad(Utils.errBody('You cant use this route in production env'));
}

function onlySandboxProject(req, res, next) {
  if (req.projectType === process.env.xcodeclazzLive) next();
  else return new RESPONSE(res).bad(Utils.errBody('You cant use this route in xcodeclazz live'));
}

function onlyLiveProject(req, res, next) {
  if (req.projectType === process.env.xcodeclazzLive) next();
  else return new RESPONSE(res).bad(Utils.errBody('You cant use this route in xcodeclazz live'));
}

function hasManagementPermission(req, res, next) {
  if (hasRole(req.user, ROLE.MANAGEMENT)) return next();
  return new RESPONSE(res).forbidden(Utils.errBody('Access denied, You are not the authorized user'));
}

const WHITELIST_DOMAINS = ['http://127.0.0.1:5500', 'http://xcodeclazz.com', 'https://xcodeclazz.com', 'https://xcodeclazz.surge.sh'];
function corsCheck(req, res, next) {
  next(); // for now let's allow everyone
  // TODO: not every device has origin, like mobile, we can add though in retrofit for exmaple
  // if (isTesting(req.env)) return next();
  // // https://www.npmjs.com/package/cors#enable-cors-for-a-single-route
  // if (WHITELIST_DOMAINS.indexOf(req.header('Origin')) !== -1) {
  //   return next();
  // } else {
  //   return new RESPONSE(res).internalServerError(Utils.errBody('Not allowed by CORS'));
  // }
}

function hasRootPermission(req, res, next) {
  if (isEnvEqual(req.env)) return next();
  if (hasRole(req.user, ROLE.ROOT)) return next();
  return new RESPONSE(res).forbidden(Utils.errBody('Access denied, You are not the authorized user'));
}

function onlyForDesktopPlatform(req, res, next) {
  let platformName = req.headers[header_keys.xcodeclazz_access_platform_names_array];

  if (_.isUndefined(platformName)) return new RESPONSE(res).forbidden(Utils.errBody('Not allow to access this route'));
  if (typeof platformName != 'string') return new RESPONSE(res).forbidden(Utils.errBody('Not allow to access this route'));

  const first = platformName.replace('[', '');
  const second = first.replace(']', '');

  const platformsNames = second.split(', ');
  const booleanBucket = platformsNames.map(e => _.includes([PLATFORMS.DESKTOP, PLATFORMS.WINDOWS], e));
  const anyMatched = _.includes(booleanBucket, true);
  if (anyMatched) return next();
  else return new RESPONSE(res).forbidden(Utils.errBody('Not allow to access this route'));
}

function onlyForWindowsPlatform(req, res, next) {
  next();
}

function onlyForIosPlatform(req, res, next) {
  next();
}

function onlyForAndroidPlatform(req, res, next) {
  next();
}

function onlyForOtherPlatform(req, res, next) {
  next();
}

function headerChecker(req, res, next) {
  if (
    !req.headers[header_keys.xcodeclazz_access_platform_names_array] ||
    !req.headers[header_keys.xcodeclazz_route_caller_xcodeclazz] ||
    !req.headers[header_keys.xcodeclazz_app_version]
  ) new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));
  else next();
}

const userIdEquals = (field = undefined) => (req, res, next) => {
  if (_.isUndefined(field)) return new RESPONSE(res).forbidden(Utils.errBody('Please provide id, to match with current logged in user'));
  else if (req.user?._id.toString() === req.body[field].toString()) next();
  else return new RESPONSE(res).forbidden(Utils.errBody('You are NOT the correct user to perfrom this action.'));
}

// this middleware ensure that no older version on apps can use the new implementation, they all have to update the application,
const appVersionChecker = (strictness_level = middleware_strictness.dont_allow) => (req, res, next) => {
  if (strictness_level.match(middleware_strictness.spoof_them)) return next();

  const { xcodeclazz_route_caller_xcodeclazz, xcodeclazz_access_platform_names_array, xcodeclazz_app_version } =
    _.pick(req.headers, [header_keys.xcodeclazz_route_caller_xcodeclazz, header_keys.xcodeclazz_access_platform_names_array, header_keys.xcodeclazz_app_version]);

  if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.CONTRIBUTOR) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_app_version >= versions.android_env.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_app_version >= versions.windows_electron_env.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.SHOP) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_app_version >= versions.android_shop.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_app_version >= versions.windows_electron_shop.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.END) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_app_version >= versions.android_end.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_app_version >= versions.windows_electron_end.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.ADMIN) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_app_version >= versions.android_admin.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_app_version >= versions.windows_electron_admin.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.EMPLOYEE) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_app_version >= versions.android_employee.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_app_version >= versions.windows_electron_employee.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));
}

// this middleware ensure that no latest version on apps can use the old server code implementation, they will have to wait for the latest server code to be updated,
const serverVersionChecker = (strictness_level = middleware_strictness.dont_allow) => (req, res, next) => {
  if (strictness_level.match(middleware_strictness.spoof_them)) return next();

  const { xcodeclazz_route_caller_xcodeclazz, xcodeclazz_access_platform_names_array, xcodeclazz_server_version } =
    _.pick(req.headers, ['xcodeclazz_route_caller_xcodeclazz', 'xcodeclazz_access_platform_names_array', 'xcodeclazz_server_version']);

  if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.CONTRIBUTOR) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_server_version <= versions.server_env.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_server_version <= versions.server_env.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.SHOP) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_server_version <= versions.server_shop.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_server_version <= versions.server_shop.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.END) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_server_version <= versions.server_end.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_server_version <= versions.server_end.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.ADMIN) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_server_version <= versions.server_admin.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_server_version <= versions.server_admin.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else if (xcodeclazz_route_caller_xcodeclazz == APP_NAMES.EMPLOYEE) {

    if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (xcodeclazz_server_version <= versions.server_employee.latest) return next() }
    else if (xcodeclazz_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (xcodeclazz_server_version <= versions.server_employee.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));
}

const onlyAppsAllowed = (allowedxcodeclazzs = []) => (req, res, next) => {
  let xcodeclazz = req.headers[header_keys.xcodeclazz_route_caller_xcodeclazz];

  if (_.isUndefined(xcodeclazz)) return new RESPONSE(res).forbidden(Utils.errBody(`Only ${allowedxcodeclazzs} can access this route.`));
  if (typeof xcodeclazz != 'string') return new RESPONSE(res).forbidden(Utils.errBody(`Only ${allowedxcodeclazzs} can access this route.`));

  if (_.includes(APP_NAMES, xcodeclazz) && _.includes(allowedxcodeclazzs, xcodeclazz)) next();
  else return new RESPONSE(res).forbidden(Utils.errBody(`Only ${allowedxcodeclazzs} can access this route.`));
}

function validateRequestBody(req, res, next) {
  const errors = validationResult(req);
  if (not(errors.isEmpty())) {
    const lines = {};
    _.each(errors.array(), (err) => {
      if (!lines[err?.param]) lines[err?.param] = `$~ '${err?.msg}' @${err?.location} = ${err?.param} -> ${JSON.stringify(err?.value)}`;
    });
    return new RESPONSE(res).unprocessableEntity(Utils.errBody(_.join(_.values(lines), ' | ')));
  }
  else next();
}

const isTesting = (env) => typeof env == 'string' ? env == process.env.TESTING : false;
const isEnvEqual = (env) => typeof env == 'string' ? env == process.env.NODE_ENV : false;

module.exports = {
  onlyLiveProject,
  routeDeprecated,
  onlyForIosPlatform,
  onlyForOtherPlatform,
  onlyForWindowsPlatform,
  onlyForAndroidPlatform,
  onlyForDesktopPlatform,
  hasManagementPermission,
  maintenanceStateCheck,
  serverVersionChecker,
  validateRequestBody,
  authenticationCheck,
  onlySandboxProject,
  onlyDevelopmentEnv,
  hasRootPermission,
  appVersionChecker,
  asyncMiddleware,
  onlyAppsAllowed,
  formDataParser,
  winstonLogger,
  headerChecker,
  userIdEquals,
  corsCheck
};