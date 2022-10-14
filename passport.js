const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const Models = require("./models.js");
const passportJwt = require("passport-jwt");
const Users = Models.User;
const JWTStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(
  new localStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    (username, password, callback) => {
      console.log(`${username} ${password}`);
      Users.findOne({ Username: username }, (err, user) => {
        if (err) {
          console.log(err);
          return callback(err);
        }
        if (!user) {
          console.log("Incorrect username.");
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }
if (!user.validatePassword(password)) {
      console.log('incorrect password');
} 
        console.log("Finished.");
        return callback(null, user);
      });
    }
  )
);

passport.use(
  new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "your_jwt_secret",
  }, (jwtPayload, callback) => {
  	return Users.findById(jwtPayload._id).then((user) => callback(null, user)).catch((err) => callback(err));
  })
);
