// imports
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import passportLocal from 'passport-local';
import UsersDb from '../../lib/UsersDb.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const LocalStrategy = passportLocal.Strategy;


// init dotenv
dotenv.config();

// init router
const app = express.Router();

// init user database
const usersData = new UsersDb();

// init passport
passport.use(
  new LocalStrategy({ 
    usernameField: 'username', 
    passwordField: 'password'
  },
    async (username, password, done) => {
      try {
        // get user by username
        const user = await usersData.findOne(username);

        // check if user exists
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        // check if password is correct
        if (!(await isValidPassword(user, password))) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (e) {
        return done(e);
      }
    }
  )
);

app.post('/login', (req, res) => 
  passport.authenticate('local', (error, user, info) => {
    console.log(user);
    if(error) {
      res.status(401).json(info);
    } else if(!user) {
      res.status(401).json(info);
    } else {

      // jwt token
      const jwtData = {
        id: user.id,
        username: user.username,
        type: user.type
      };

      // create and sign the jwt
      const token = jwt.sign(jwtData, process.env.JWT_UNIQUE_KEY, {
        expiresIn: parseInt(process.env.JWT_LIFETIME)
      });
      
      res.status(200).json({
        succes: true,
        token: token,
        user: {
          id: user.id,
          user: user.email,
          type: user.type
        } 
      });
    }
  })(req, res)
);

/**
 * Get Hash from password 
 */
app.post('/hashpass', (req, res) => {
  bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUNDS)).then(function(hash) {
    console.log(hash);
    res.status(200).send(hash);
  });
});

/**
 * Check if hashed password matches the database
 * @param {*} user 
 * @param {*} password 
 * @returns 
 */
const isValidPassword = async (user, password) => {
  const match = await bcrypt.compare(password, user.password);
  return match;
};

export default app;