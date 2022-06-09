const express = require('express');
const path = require('path');
const cors = require('cors');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const cors_config = {
  origin: "*" // all
}

const app = express();

app.use(favicon(path.join(__dirname, 'images', 'logo192.png')));
app.use(express.static('images'));
app.use(express.static('styles'));
app.use(bodyParser.json());
app.use(cors(cors_config));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.post(`/post`, (req, res) => {
  res.send({
    message: "You send these data's",
    body: req.body,
  });
});

app.get('/app', (req, res) => {
  // res.send({ message: 'success' });
  const { c, cpp, node, python, java } = require('compile-run');
  const sourcecode = `
for i in range(10000):
  print(i)
  `;
  let resultPromise = python.runSource(sourcecode);
  resultPromise
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      console.log(err);
    });
});

app.get(`/`, (req, res) => {
  res.render('index');
});

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`server is running at PORT: ${port}`);
});