const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const express = require('express');
const favicon = require('serve-favicon');
const serveIndex = require('serve-index');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const path = require('path');
// dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
dotenv.config();

const cors_config = {
    origin: "*" // all
}

// creating express app
const app = express();

// middlewares
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.text())
app.use(cors(cors_config));
app.use(express.static(path.join(__dirname, '/../../client/build')));
app.use(favicon(path.join(__dirname, '/../../images/logo192.png')));
app.use(express.static('images'));
app.use(express.static('styles'));

app.set('views', path.join(__dirname, '/../../views'));
app.set('view engine', 'hbs');

// file indexes
app.use('/uploads', express.static(path.join(__dirname, '/../../uploads')), serveIndex('uploads', { 'icons': true }))
app.use('/files', express.static(path.join(__dirname, '/../../files')), serveIndex('files', { 'icons': true }))

const config = require('config'); // we load the data from the JSON files if needed
const morgan = require('morgan'); // use morgan to log request incoming at command line
// app.get('env'); // return the env, dev || prod
// console.log(config) // return the .json file from config folder

// only show the log when it is dev. don't turn this on while deploy on server i.e digital ocean
if (config.util.getEnv('NODE_ENV') === process.env.DEVELOPMENT) app.use(morgan(`(${config.get('projectType')}) :method :url :status :res[content-length] - :response-time ms`)); // 'tiny' || 'combined' (outputs the Apache style LOGs)
if (config.util.getEnv('NODE_ENV') === process.env.PRODUCTION) app.use(morgan(`(${config.get('projectType')}) :method :url :status :res[content-length] - :response-time ms`)); // 'tiny' || 'combined' (outputs the Apache style LOGs)

module.exports = { app, express }