const STATUS_CODE = require("../static data/response_status_code");

class RESPONSE {

  constructor(res) {
    this.res = res;
  }
  setCookies(key, value) { this.res.cookie(key, value, {sameSite: 'none', secure: false}); return this; }

  internalServerError (o) { return this.res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(o); }
  unprocessableEntity (o) { return this.res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).json(o); }
  serviceUnavailable (o) { return this.res.status(STATUS_CODE.SERVICE_UNAVAILABLE).json(o); }
  upgradeRequired (o) { return this.res.status(STATUS_CODE.UPGRADE_REQUIRED).json(o); }
  notImplemented (o) { return this.res.status(STATUS_CODE.NOT_IMPLEMENTED).json(o); }
  notAcceptable (o) { return this.res.status(STATUS_CODE.NOT_ACCEPTABLE).json(o); }
  unauthorized (o) { return this.res.status(STATUS_CODE.UNAUTHORIZED).json(o); }
  notModified (o) { return this.res.status(STATUS_CODE.NOT_MODIFIED).json(o); }
  forbidden (o) { return this.res.status(STATUS_CODE.FORBIDDEN).json(o); }
  notFound (o) { return this.res.status(STATUS_CODE.NOT_FOUND).json(o); }
  accepted (o) { return this.res.status(STATUS_CODE.ACCEPTED).json(o); }
  created (o) { return this.res.status(STATUS_CODE.CREATED).json(o); }
  bad (o) { return this.res.status(STATUS_CODE.BAD_REQUEST).json(o); }
  ok (o) { return this.res.status(STATUS_CODE.OK).json(o); }

}

module.exports = RESPONSE;