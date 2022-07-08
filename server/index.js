const winston = require('winston');
const { app } = require('./connections/express');

require('./startup/environment')();
require('./startup/logging')();
require('./startup/config')();
require('./startup/mkdir')();
require('./startup/routes')(app);
require('./connections/database');

app.get(`/`, (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  winston.info(`Server is up and running at port: ${PORT}`);
});

module.exports = app;