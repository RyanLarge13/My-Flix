const express = require("express"),
  morgan = require("morgan"),
  path = require("path"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require("mongoose"),
  cors = require("cors");
const dotenv = require("dotenv").config();
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:1234",
  "https://my-flix-production.up.railway.app/",
];
const port = process.env.PORT || 8080;
const { check, validationResult } = require("express-validator");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const app = express();

//Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application does not allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("common"));

//Connecting to the database
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log(`You are in!!!!!`);
  })
  .catch((err) => {
    if (err) console.log(`Error!: ${err}`);
  });

//Begin defining all routes
//GET Requests
app.get("/", (req, res) => {
  res.status(201).sendFile(__dirname + "/public/documentation.html");
});

app.get("/movies", (req, res) => {
  Movies.find({})
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.get(
  "/movies/genre/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.title })
      .then((movie) => {
        res.status(201).json(movie.Genre.Description);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.get(
  "/movies/director/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.name })
      .then((movie) => {
        res.status(201).json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        if (!user) res.status(500).send("There is no user with that name.");
        else res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

//POST Requests
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then(async (user) => {
        if (user) {
          return res.status(400).send(`${req.body.Username} already exists..`);
        } else {
          await Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res
                .status(201)
                .json({ message: "Your account was created!" }, user);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send(`Error: ${err} `);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.post(
  "/:users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updateUser) => {
        if (err) {
          console.error(err);
          res.status(500).send(`Error ${err}`);
        } else {
          res.json(updateUser);
        }
      }
    );
  }
);

//PUT Requests
app.put(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.body.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true },
      (err, updateUser) => {
        if (err) {
          console.error(err);
          res.status(500).send(`Error ${err}`);
        } else {
          res.json(updateUser);
        }
      }
    );
  }
);

//Delete Requests
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ "Users.Username": req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(`${req.params.Username} was not found.`);
        } else {
          res
            .status(200)
            .send(`${req.params.Username} was successfully deleted.`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.delete(
  "/:users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        if (!user) res.status(500).send(`${req.params.Username} was not found`);
        else {
          user
            .findOneAndRemove({ "Users.FavoriteMovies": req.params.MovieID })
            .then((movie) => {
              movie.delete();
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

app.delete("/users/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(`${req.params.Username} was not found.`);
      } else {
        res
          .status(200)
          .send(`${req.params.Username} was successfully deleted.`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Your app is running on port ${port}.`);
});
