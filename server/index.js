const express = require('express');
const path = require('path');
const cors = require('cors');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

require('./connections/database');

dotenv.config();
const cors_config = {
  origin: "*" // all
}

const app = express();

app.use(favicon(path.join(__dirname, '..' , 'images', 'logo192.png')));
app.use(express.static('images'));
app.use(express.static('styles'));
app.use(bodyParser.json());
app.use(cors(cors_config));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'hbs');

app.post(`/post`, (req, res) => {
  res.send({
    message: "You send these data's",
    body: req.body,
  });
});

app.get('/app', (req, res) => {
  const resultLimitCharacter = 30000;
  const errorLimitCharacter = 30000;

  const forMinutes = 60000 /* 1 Min */ * 20; // should not take more then 20 minutes!
  req.setTimeout(forMinutes); // because this route is going to do a lot havvy work!

  const { c, cpp, node, python, java } = require('compile-run');
  python.runFile('../explorer/code/gouravgupta840@gmai.com/project_one/run.py', {
    timeout: forMinutes,
    compileTimeout: forMinutes,
    stderrLimit: errorLimitCharacter,
    stdoutLimit: resultLimitCharacter,
    // stdin:
    // compilerArgs:
    // executionPath:
    // compilationPath:
  }, (err, result) => res.send({ err, result: { connector, ...result, lang: 'python' } }));
});

app.get(`/`, (req, res) => {
  res.render('index');
});

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`server is running at PORT: ${port}`);
});