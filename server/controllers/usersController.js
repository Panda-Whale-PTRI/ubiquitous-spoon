const pool = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const usersController = {};

// Middleware to check validity of username
usersController.checkUsername = (req, res, next) => {
  const user = req.body.username.toLowerCase();
  const text = `SELECT * FROM ubiquitous_spoon.users WHERE username = '${user}'`;
  pool.query(text, (err, response) => {
    if (err) {
      return next(err);
    }
    if (response.rows.length === 0) {
      res.locals.username = user;
    } else {
      return next({ log: 'checkUsername', message: { err: 'Username already exists' } });
    }
    next();
  });
};

usersController.checkLogin = (req, res, next) => {
  const user = req.body.username.toLowerCase();
  const password = req.body.password;
  let bcryptPassword;

  // Query database using user input (username & password)
  const text = `SELECT * FROM ubiquitous_spoon.users WHERE username = '${user}'`;
  pool.query(text, (err, response) => {
    if (err) {
      return next(err);
    }
    // If no response, it means user doesn't have acct yet
    if (response.rows.length === 0) {
      return next({ log: 'checkLogin', message: { err: 'Username not found' } });
    }
    // If user does exist, grab bcrypted password from DB
    bcryptPassword = response.rows[0].password;

    // Compare bcrypted password to password user entered
    bcrypt.compare(password, bcryptPassword, function (err, isMatch) {
      console.log('password matched ->', isMatch);
      if (!isMatch) {
        // If they don't match, return error "Wrong Password"
        return next({ log: 'checkLogin', message: { err: 'Wrong password' } });
      } else if (err) {
        return next(err);
      } else {
        next();
      }
    });
  });
};

usersController.logout = (req, res, next) => {
  // Get session number
  // clear session
  next();
};
// Check to make sure passwords match, then encrypt
usersController.checkPassword = (req, res, next) => {
  const { password1, password2 } = req.body;

  if (password1 !== password2) {
    return next({ log: 'checkPassword', message: { err: 'Passwords must match ' } });
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password1, salt, function (err, hash) {
      res.locals.password = hash;
      next();
    });
  });
};

// If username and password look good, add new user to database
usersController.addUser = (req, res, next) => {
  const text = `INSERT INTO ubiquitous_spoon.users (username, password, name, email, vegan, vegetarian, gluten_free)
  VALUES('${req.body.username}', '${res.locals.password}', '${req.body.name}', '${req.body.email}', '${req.body.vegan}', '${req.body.vegetarian}', '${req.body.glutenFree}');`;
  pool.query(text, (err, response) => {
    if (err) {
      return next({ log: 'addUser', message: { err: 'Error in addUser' } });
    }
    next();
  });
};

// Insert new session into session table in db and set cookie
usersController.createSession = (req, res, next) => {
  const ssid = uuidv4();
  const text = `INSERT INTO ubiquitous_spoon.sessions (id, created_at) VALUES('${ssid}', current_timestamp);`;
  pool.query(text, (err, response) => {
    if (err) {
      return next({ log: 'createSession', message: { err: 'Error in createSession' } });
    }
    res.cookie('ssid', ssid, { httpOnly: true });
    next();
  });
};

usersController.getUserInfo = (req, res, next) => {
  next();
};

usersController.updateUserInfo = (req, res, next) => {
  next();
};

module.exports = usersController;