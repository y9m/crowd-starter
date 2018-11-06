const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db');
const sessionStore = new SequelizeStore({ db });

const app = express();

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  app.use(morgan('dev'));
  app.use(
    express.static(path.join(__dirname, '..', '..', 'frontend', 'public'))
  );
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'Exposed secret',
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

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
  const port = process.env.PORT || 3000;
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

module.exports = app;
