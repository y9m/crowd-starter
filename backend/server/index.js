const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db');

const app = express();

const createApp = () => {
  app.use(morgan('dev'));
  app.use(
    express.static(path.join(__dirname, '..', '..', 'frontend', 'public'))
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'blah blah',
      resave: false,
      saveUninitialized: false
    })
  );

  app.use('/api', require('./api'));

  app.use('*', (req, res) => {
    res.sendFile(
      path.join(__dirname, '..', '..', 'frontend', 'public', 'index.html')
    );
  });

  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  const port = process.env.port || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
  });
};

const syncDb = () => db.sync();

const bootApp = async () => {
  await sessionStore.sync();
  await syncDb();
  await createApp();
  await startListening();
};

bootApp();
