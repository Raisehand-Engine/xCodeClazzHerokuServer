const fs = require('fs');
const _ = require('lodash');
const Utils = require('../helper/utils');
const RESPONSE = require('../classes/RESPONSER');

const {
    image_containers
} = require('../classes/RaisehandCloudinaryImageService');

const { version } = require('../connections/express');
const { mongo, connector } = require('../connections/database');

const xcodeclazz_routes = require('../routes/xcodeclazz/routes');

const not = (o) => !o;

module.exports = function (app) {

    // ROUTE NAMING CONVENTION -> {r_version}/api/{actor_name}/{collection_name-> singular or plural}/{purpose}
    // what data sending and how usefull that information for client
    // what is receiving, how important that data is,

    // hooking current environment name on every route 'req' param
    app.use((req, res, next) => {
        // req.projectType = connector.projectType;
        // req.env = connector.ENV;
        next();
    });

    app.use(`${version}/api/xcodeclazz`, xcodeclazz_routes);

};