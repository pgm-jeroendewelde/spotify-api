// imports
import passport from 'passport';
import passportJWT from 'passport-jwt';
import dotenv from 'dotenv';

// init dotenv
dotenv.config();

// init passport
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

// define options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_UNIQUE_KEY,
}

// configuration passport jwt
passport.use(
  new JwtStrategy(jwtOptions, async (jwtData, done) => {
    try {
      console.log(`${jwtData.username} is doing an authenticated request`);
      return done(null, jwtData);
    } catch (error) {
      done(null, error);
    }
  })
);


export default (req, res, next) => {

  // Save endpoint where user is calling from & method
  const endpoint = req.baseUrl;
  const method = req.method;

  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    const userType = user.type;

    // filter by endpoint and check if user has permission
    switch (endpoint) {
      case '/users':
        if(userType === 'admin') {
          next();
          return false;
        } else if((req.url !== '/') && (req.url === `/${user.id}`)) {
          next();
          return false;
        } else {
          res.status(401).json({
            error: "Members don't have authorization to fetch User-data of others"
          })
        }
        break;

      case '/songs':
        if(userType === 'admin') {
          next();
          return false;
        } else if(req.method === 'GET') {
          next();
          return false;
        } else {
          res.status(401).json({
            error: "Members don't have authorization to modify songs"
          })
        }
        break;

      case '/playlists':
        if(userType === 'admin' ) {
          next();
          return false;
        } else if((req.url !== '/') && (req.url === `/${user.id}`)) {
          next();
          return false;
        } else {
          res.status(401).json({
            error: "Members don't have authorization to modify other playlists"
          })
        }
        break;
    }
  })(req, res, next)
};