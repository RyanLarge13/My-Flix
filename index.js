const { resolveSoa } = require('dns');
const express = require('express'), morgan = require('morgan'), path = require('path'), bodyParser = require('body-parser'), uuid = require('uuid');
const { ppid } = require('process');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('common'));

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
    // movies.find((movie) => {
        res.send('Return the director of superman');
    //   if (movie.title === req.params.title) {
    //     return res.send(movie.directors);
    //   } else {
    //     return res.send(res.status(204), 'No directors for this movie')
    //   }
    // });
});

app.put('/register', (req, res) => {
    res.send('You are on the registration page!!!!!!!');
});

app.get('/:user/settings', (req, res) => {
    res.send('You are officially in your user settings');
});

app.post('/:user/favorites/add/:movie', (req, res) => {
    res.send('You are about to add a movie to your favorites list');
});

app.delete(':user/favorites/:movie', (req, res) => {
    res.send('You hae succesfully deleted your movie')
});

app.delete(':user/settings/delete', (req, res) => {
    res.send('You are about to delete your account');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
});

app.listen(8080, () => {
    console.log('Your app is running on port 8080');
});