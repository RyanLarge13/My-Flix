const express = require('express'), morgan = require('morgan'), fs = require('fs'), path = require('path');
const app = express();

let movies = [
    {
        title: 'Star Wars Revenge of The Sith',
        release: '2005'
    },
    {
        title: 'Moana',
        release: '2016'
    },
    {
        title: 'Shawshank Redemption',
        release: '1994'
    },
    {
        title: 'Superman',
        release: '1978'
    }
];

app.use(express.static('public'));

app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to my movie app!!!');
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
});

app.listen(8080, () => {
    console.log('Your app is running on port 8080');
});