const express = require("express"),
  morgan = require("morgan"),
  path = require("path"),
  bodyParser = require("body-parser"),
  uuid = require("uuid"),
  mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(morgan("common"));

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

mongoose
  .connect("mongodb://127.0.0.1:27017/My-Flix?", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log(
      `You are in!!!!!. Your connection state is:`,
      connection.connections
    );
  })
  .catch((err) => {
    if (err) console.log(`Error!: ${err}`);
  });

app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.status(201).sendFile(__dirname + "/public/documentation.html");
});

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

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

app.get("/movies/genre/:title", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.title })
    .then((movie) => {
      res.status(201).json(movie.Genre.Description);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.get("/movies/director/:name", passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.name })
    .then((movie) => {
      res.status(201).json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.get("/users", passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

<<<<<<< HEAD
app.get("/users/:Username", passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if (!user) res.status(500).send("There is no user with that name.");
      else res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

app.post("/users/:Username", passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(`${req.body.Username} already exists..`);
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
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
});

app.post("/:users/:Username/movies/:MovieID", passport.authenticate('jwt', {session: false}), (req, res) => {
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
});

app.put("/users/:Username", passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
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
});

app.delete("/users/:Username", passport.authenticate('jwt', {session: false}), (req, res) => {
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
});

app.delete("/:users/:Username/movies/:MovieID", passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) res.status(500).send(`${req.params.Username} was not found`);
      else
        res
          .status(201)
          .send(
            `Your favorite movie ${req.params.MovieID} was succesfully deleted.`
          );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(`Error: ${err}`);
    });
=======
app.delete('/users/:Username', (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username }).then((user) => {
		if (!user) {
			res.status(400).send(`${req.params.Username} was not found.`);
		} else {
			res.status(200).send(`${req.params.Username} was successfully deleted.`);
		}
	}).catch((err) => {
		console.error(err);
		res.status(500).send(`Error: ${err}`);
	});
});

app.delete('/:users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndRemove({ FavoriteMovies: req.params.MovieID }).then((user) => {
		if (!user) res.status(500).send(`${req.params.Username} was not found`);
		else {
			user.FavoriteMovies.forEach(movie => {
				if (movie === req.params.MovieID) {
					res.status(201).send(`${movie} has been deleted from your favorites.`);
				} 
			});
		}
	}).catch((err) => {
		console.log(err);
		res.status(500).send(`Error: ${err}`);
	})
>>>>>>> 6dd36dd28ec5483ac17da9d51748d5e562218e44
});

app.use((err, req, res, next) => {
  console.error(err.stack);
});

app.listen(8080, () => {
  console.log("Your app is running on port 8080");
});
