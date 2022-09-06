const express = require('express'), morgan = require('morgan'), path = require('path'), bodyParser = require('body-parser'), uuid = require('uuid'), mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.movie;
const Users = Model.User;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('common'));

mongoose.connect('mongodb://localhost:27017/[movie_api]', { useNewUrlParser: true, useUnifiedTopology: true });

let movies = [
  {
    title: "Star Wars Revenge of The Sith",
    desc: "Anikan Skywalker turns gets chopped in half and burns in lava!!",
    genre: "Action",
    directors: "George Lucas",
    imgURL:
      "https://resizing.flixster.com/Fb-j0fBpezcHkXUSiIWHZRjlh-Q=/206x305/v2/https://flxt.tmsimg.com/assets/p35273_p_v8_av.jpg",
  },
  {
    title: "Moana",
    desc: "A teen that is way too young goes out to the ocean on a boat of sticks",
    genre: "Adventure",
    directors: ["Ron Clements", "John Musker"],
    imgURL:
      "https://d1nslcd7m2225b.cloudfront.net/Pictures/480xAny/2/1/1/1250211_Moana.jpg",
  },
  {
    title: "Shawshank Redemption",
    desc: "A man gets wrongly accused! He spends years in prison",
    genre: "Drama",
    directors: ["Frank darabont"],
    imgURL:
      "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
  },
  {
    title: "Superman",
    desc: "The best movie ever",
    genre: "Action",
    directors: ["Richard Donner"],
    imgURL:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Superman_%28Christopher_Reeve_-_1978%29.jpg/220px-Superman_%28Christopher_Reeve_-_1978%29.jpg",
  },
  {
    title: "127 Hours",
    desc: "When you are stuck in a desert with no water becasue your arm is stuck in a rock, the solution is to chop it off",
    genre: "Drama",
    directors: ["Danny Boyle"],
    imgURL:
      "https://m.media-amazon.com/images/M/MV5BMTc2NjMzOTE3Ml5BMl5BanBnXkFtZTcwMDE0OTc5Mw@@._V1_.jpg",
  },
];


app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:title', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.title === req.params.title;
        })
    );
});

app.get('/movies/:title/genre', (req, res) => {
    movies.find((movie) => {
        if (movie.title === req.params.title) {
            return res.send(movie.genre);
        }
    })
});

app.get('/movies/:title/directors', (req, res) => {
        res.send('Return the director of superman');
});

app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username }).then((user) => {
    	if (user) {
    		return res.status(400).send(`${req.body.Username} already exists..`);
    	} else {
    		Users.create({
    			Username: req.body.Username,
    			Password: req.body.Password,
    			Email: req.body.Email, 
    			Birthday: req.body.Birthday
    		}).then((user) => {
    			res.status(201).json(user)
    		}).catch((err) => {
    			console.error(err);
    			res.status(500).send(`Error: ${err} `);
    		});
    	}
    }).catch((err) => {
    	console.error(err);
    	res.status(500).send(`Error: ${err}`);
    });
});

app.get('/users', (req, res) => {
	User.find().then((users) => {
		res.status(201).json(users);
	}).catch((err) => {
		console.error(err);
		res.status(500).send(`Error: ${err}`);
	});
});

app.get('users/:Username', (req, res) => {
	Users.findOne({ Username: req.params.Username }).then((user) => {
		res.json(user);
	}).catch((err) => {
		console.error(err);
		res.status(500).send(`Error: ${err}`);
	});
});

app.get('/:user/settings', (req, res) => {
    res.send('You are officially in your user settings');
});

app.put('/:user/favorites/add/:title', (req, res) => {
    res.send('You are about to add a movie to your favorites list');
});

app.put('users/:Username', (req, res) => {
	Users.findOneAndUpdate({ Username: req.params.Username }, { $set: {
		Username: req.body.Username,
		Password: req.body.Password,
		Email: req.body.Email,
		Birthday: req.body.Birthday
	}	}, { new: true }, (err, updateUser) => {
		if (err) {
			console.error(err);
			res.status(500).send(`Error ${err}`);
		} else {
			res.json(updateUser);
		}
	});
});

app.delete('/:user/favorites/delete/:title', (req, res) => {
    res.send('You have deleted your favorite movie');
});

app.delete('/:user/settings/delete', (req, res) => {
    res.send('You have offically deleted your account');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
});

app.listen(8080, () => {
    console.log('Your app is running on port 8080');
});