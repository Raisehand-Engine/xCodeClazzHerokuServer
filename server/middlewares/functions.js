const _ = require('lodash');
const winston = require('winston');
const Utils = require('../helper/utils');
const RESPONSE = require('../classes/RESPONSER');
const { validationResult } = require('express-validator');

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
  if (req.projectType === process.env.RaisehandSandbox) next();
  else return new RESPONSE(res).bad(Utils.errBody('You cant use this route in raisehand live'));
}

function onlyLiveProject(req, res, next) {
  if (req.projectType === process.env.RaisehandLive) next();
  else return new RESPONSE(res).bad(Utils.errBody('You cant use this route in raisehand sandbox'));
}

const WHITELIST_DOMAINS = ['http://127.0.0.1:5500'];
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

function onlyForDesktopPlatform(req, res, next) {
  let platformName = req.headers[header_keys.raisehand_access_platform_names_array];

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

// Make this print pretty as well
function routeXRay(req, res, next) {
  if (process.env.HEADER == 'true') {
    console.log("****************************");
    console.log("**********HEADERS***********");
    console.log("****************************");
    console.log(req.headers);
  }

  if (process.env.REQBODY == 'true') {
    console.log("****************************");
    console.log("************BODY************");
    console.log("****************************");
    console.log(req.body);
  }

  // params
  // query
  // ...

  next();
}

function headerChecker(req, res, next) {
  if (
    !req.headers[header_keys.raisehand_access_platform_names_array] ||
    !req.headers[header_keys.raisehand_route_caller_appname] ||
    !req.headers[header_keys.raisehand_app_version]
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

  const { raisehand_route_caller_appname, raisehand_access_platform_names_array, raisehand_app_version } =
    _.pick(req.headers, [header_keys.raisehand_route_caller_appname, header_keys.raisehand_access_platform_names_array, header_keys.raisehand_app_version]);

  if (raisehand_route_caller_appname == APP_NAMES.CONTRIBUTOR) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_app_version >= versions.android_env.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_app_version >= versions.windows_electron_env.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else if (raisehand_route_caller_appname == APP_NAMES.SHOP) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_app_version >= versions.android_shop.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_app_version >= versions.windows_electron_shop.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else if (raisehand_route_caller_appname == APP_NAMES.END) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_app_version >= versions.android_end.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_app_version >= versions.windows_electron_end.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else if (raisehand_route_caller_appname == APP_NAMES.ADMIN) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_app_version >= versions.android_admin.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_app_version >= versions.windows_electron_admin.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else if (raisehand_route_caller_appname == APP_NAMES.EMPLOYEE) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_app_version >= versions.android_employee.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_app_version >= versions.windows_electron_employee.latest) return next() }
    return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));

  } else return new RESPONSE(res).upgradeRequired(Utils.errBody('Please update your application'));
}

// this middleware ensure that no latest version on apps can use the old server code implementation, they will have to wait for the latest server code to be updated,
const serverVersionChecker = (strictness_level = middleware_strictness.dont_allow) => (req, res, next) => {
  if (strictness_level.match(middleware_strictness.spoof_them)) return next();

  const { raisehand_route_caller_appname, raisehand_access_platform_names_array, raisehand_server_version } =
    _.pick(req.headers, ['raisehand_route_caller_appname', 'raisehand_access_platform_names_array', 'raisehand_server_version']);

  if (raisehand_route_caller_appname == APP_NAMES.CONTRIBUTOR) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_server_version <= versions.server_env.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_server_version <= versions.server_env.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else if (raisehand_route_caller_appname == APP_NAMES.SHOP) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_server_version <= versions.server_shop.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_server_version <= versions.server_shop.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else if (raisehand_route_caller_appname == APP_NAMES.END) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_server_version <= versions.server_end.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_server_version <= versions.server_end.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else if (raisehand_route_caller_appname == APP_NAMES.ADMIN) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_server_version <= versions.server_admin.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_server_version <= versions.server_admin.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else if (raisehand_route_caller_appname == APP_NAMES.EMPLOYEE) {

    if (raisehand_access_platform_names_array.includes(PLATFORMS.ANDROID)) { if (raisehand_server_version <= versions.server_employee.latest) return next() }
    else if (raisehand_access_platform_names_array.includes(PLATFORMS.WINDOWS)) { if (raisehand_server_version <= versions.server_employee.latest) return next() }
    return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));

  } else return new RESPONSE(res).notImplemented(Utils.errBody('Please wait while server is getting ready for you'));
}

const onlyAppsAllowed = (allowedAppNames = []) => (req, res, next) => {
  let appName = req.headers[header_keys.raisehand_route_caller_appname];

  if (_.isUndefined(appName)) return new RESPONSE(res).forbidden(Utils.errBody(`Only ${allowedAppNames} can access this route.`));
  if (typeof appName != 'string') return new RESPONSE(res).forbidden(Utils.errBody(`Only ${allowedAppNames} can access this route.`));

  if (_.includes(APP_NAMES, appName) && _.includes(allowedAppNames, appName)) next();
  else return new RESPONSE(res).forbidden(Utils.errBody(`Only ${allowedAppNames} can access this route.`));
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
  maintenanceStateCheck,
  serverVersionChecker,
  validateRequestBody,
  onlySandboxProject,
  onlyDevelopmentEnv,
  appVersionChecker,
  asyncMiddleware,
  onlyAppsAllowed,
  formDataParser,
  winstonLogger,
  headerChecker,
  userIdEquals,
  routeXRay,
  corsCheck
};