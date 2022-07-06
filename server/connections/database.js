
const { MongoClient, ObjectId } = require('mongodb'); // Plain Driver
const mongoose = require('mongoose'); // ORM

const winston = require('winston');
const config = require('config');

const path = require('path');

// const dotenv = require('dotenv');
// dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const connector = {
    db_port: config.get('db_port'),
    hostName: config.get('hostName'),
    user: config.get('user'),
    projectType: config.get('projectType'),
    databaseName: config.get('databaseName'),
    replicaSetName: config.get('replicaSetName'),
    databaseUrl: config.get('url'),
    mongoOptions: {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    meta: config.get('meta'),
};

if (process.env.NODE_ENV === process.env.TESTING) {
    connector.databaseName = 'Testing';
    connector.ENV = process.env.TESTING
}
if (process.env.NODE_ENV === process.env.DEVELOPMENT) {
    connector.databaseName = 'Development';
    connector.ENV = process.env.DEVELOPMENT;
}
if (process.env.NODE_ENV === process.env.PRODUCTION) {
    connector.databaseName = 'Development';
    connector.ENV = process.env.PRODUCTION;
}
if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = process.env.DEVELOPMENT;
    connector.ENV = process.env.NODE_ENV;
}

// connecting to mongo server...
const mongo = MongoClient.connect(connector.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connect(connector.databaseUrl, connector.mongoOptions, () => winston.info(JSON.stringify(connector, null, 4)));

module.exports = { mongo, mongoose, connector, ObjectId };
