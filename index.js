const express = require('express'), morgan = require('morgan'), path = require('path'), bodyParser = require('body-parser'), uuid = require('uuid'), mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('common'));

mongoose.connect('mongodb://127.0.0.1:27017/My-Flix?', { useNewUrlParser: true, useUnifiedTopology: true }).then((connection) => {
	console.log(`You are in!!!!!. Your connection state is:`, connection.connections);
}).catch((err) => {
	if (err) console.log(`Error!: ${err}`);
});

app.get('/', (req, res) => {
	res.status(201).sendFile(__dirname + '/public/documentation.html');
})

app.get('/movies', (req, res) => {
	Movies.find().then(movies => {
		res.status(201).json(movies)
	}).catch((err) => {
		console.log(err)
		res.status(500).send(`Error: ${err}`);
	});
})

app.get('/movies/:title', (req, res) => {
    Movies.findOne({ Title: req.params.title }).then((movie) => {
		res.status(201).json(movie);
	}).catch((err) => {
		console.log(err);
		res.status(500).send(`Error: ${err}`);
	})
});

app.get('/movies/:title/genre', (req, res) => {
    Movies.findOne({ Title: req.params.title }).then(movie => {
		res.status(201).json(movie.Genre);
	}).catch((err) => {
		console.error(err);
		res.status(500).send(`Error: ${err}`);
	})
});

app.get('/movies/director/:name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.name }).then(movie => {
		res.status(201).json(movie.Director);
	}).catch((err) => {
		console.error(err);
		res.status(500).send(`Error: ${err}`);
	})
});

app.get('/users', (req, res) => {
	Users.find().then((users) => {
		res.status(201).json(users);
	}).catch((err) => {
		console.error(err);
		res.status(500).send(`Error: ${err}`);
	});
});

app.get('/users/:Username', (req, res) => {
	Users.findOne({ 'Username': req.params.Username }).then((user) => {
		if (!user) res.status(500).send('There is no user with that name.');
		else res.status(201).json(user)
	}).catch((err) => {
		console.error(err);
		res.status(500).send(`Error: ${err}`);
	});
});

app.post('/users/:Username', (req, res) => {
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

app.post('/:users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
    	$push: { favoriteMovies: req.params.MovieID } 
    	}, { new: true }, (err, updateUser) => {
    		if (err) {
    			console.error(err);
    			res.status(500).send(`Error ${err}`);
    		} else {
    			res.json(updateUser);
    		}
    });
});

app.put('/users/:Username', (req, res) => {
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

app.delete('/users/:Username', (req, res) => {
	Users.findOneAndRemove({ 'Users.Username': req.params.Username }).then((user) => {
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