const mongoose = require ('mongoose');

const movieSchema = mongoose.Schema({
	Title: { type: String, required: true }, 
	Description: { type: String, required: true}, 
	Genre: {
		Name: String, 
		Description: String
	}, 
	Director: {
		Name: String, 
		Bio: String
	}, 
	Actors: [String], 
	ImagePath: String, 
	Featured: Boolean
});

const userSchema = mongoose.Schema({
	Username: { type: String, required: true },
	Password: { type: String, required: true }, 
	Email: { type: String, required: true }, 
	Birthday: Date, 
	FavoriteMovies: [{ type: mongoose.Schema. Types.ObjectId, ref: 'movie' }]
});

const Movie = mongoose.model('Movie', movieSchema);
const user = mongoose.model('User', userSchema);

module.export.Movie = 'Movie';
module.export.User = 'User';