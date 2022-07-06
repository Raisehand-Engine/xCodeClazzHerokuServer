const winston = require('winston');
const { app } = require('./connections/express');

require('./startup/environment')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/mkdir')();
// require('./startup/routes')(app);
require('./connections/database');

app.get('/app', (req, res) => {
  const resultLimitCharacter = 30000;
  const errorLimitCharacter = 30000;

  const forMinutes = 60000 /* 1 Min */ * 20; // should not take more then 20 minutes!
  req.setTimeout(forMinutes); // because this route is going to do a lot havvy work!

  const { c, cpp, node, python, java } = require('compile-run');
  python.runFile('./explorer/code/gouravgupta840@gmai.com/project_one/run.py', {
    timeout: forMinutes,
    compileTimeout: forMinutes,
    stderrLimit: errorLimitCharacter,
    stdoutLimit: resultLimitCharacter,
    // stdin:
    // compilerArgs:
    // executionPath:
    // compilationPath:
  }, (err, result) => res.send({ err, result: { ...result, lang: 'python' } }));
});

app.get(`/`, (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  winston.info(`Server is up and running at port: ${PORT}`);
});

module.exports = app;