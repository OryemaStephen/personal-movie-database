document.addEventListener('DOMContentLoaded', () => {
    // Access elements
    const hamburger = document.getElementById('hamburger');
    const navBar = document.getElementById('navbar');
    const movieList = document.getElementById('movie-list');
    const searchTitle = document.getElementById('search');
    const searchText = document.getElementById('search-movie');
    const movieTitle = document.getElementById('movie-title');
    const movieYear = document.getElementById('movie-year');
    const movieRating = document.getElementById('movie-rating');
    const moviePoster = document.getElementById('movie-poster');
    const movieGenre = document.getElementById('movie-genre');
    const addMovieButton = document.getElementById('add-movie-btn');

    // Navigation menu functions
    function toggleNavMenu(){
        if (navBar.style.display === 'block') {
            navBar.style.display = 'none';
            hamburger.classList.remove('fa-times');
            hamburger.classList.add('fa-bars');
        } else {
            navBar.style.display = 'block';
            hamburger.classList.remove('fa-bars');
            hamburger.classList.add('fa-times');
        }
    }

    hamburger?.addEventListener('click', toggleNavMenu);

    function initialNavState(){
        if (window.innerWidth <= 768) {
            navBar.style.display = 'none';
            hamburger.classList.add('fa-bars');
        } else {
            navBar.style.display = 'flex';
            hamburger.classList.remove('fa-bars', 'fa-times');
        }
    }

    initialNavState();
    window.addEventListener('resize', initialNavState);

    const year = document.getElementById('year');
    if (year) {
        const date = new Date();
        year.innerHTML = date.getFullYear();
    }

    // Search movie from API based on the title
    if (searchTitle) {
        searchTitle.addEventListener('click', async function getData() {
            try {
                const response = await axios.get(`http://www.omdbapi.com/?apikey=6698f446&t=${searchText.value}`);
                // If request is successful
                if (response.data.Response === "True") {
                    const movie = response.data;
                    console.log(movie);
                    movieTitle.value = movie.Title;
                    movieYear.value = movie.Year;
                    movieGenre.value = movie.Genre;
                    moviePoster.src = movie.Poster;
                    moviePoster.style.display = 'block';
                    movieRating.value = movie.imdbRating;
                } else {
                    alert('Movie not found: ' + response.data.Error);
                    movieTitle.value = '';
                    movieYear.value = '';
                    movieRating.value = '';
                    movieGenre.value = '';
                    moviePoster.src = '';
                    moviePoster.style.display = 'none';
                }
            } catch (error) {
                alert('Error fetching movie details: ' + error);
                movieTitle.value = '';
                movieYear.value = '';
                movieRating.value = '';
                movieGenre.value = '';
                moviePoster.src = '';
                moviePoster.style.display = 'none';
            }
        });
    }

    // Add movie to the database
    if (addMovieButton) {
        addMovieButton.addEventListener('click', async function addMovie(event) {
            // Prevent the form from submitting
            event.preventDefault(); 

            try {
                const movie = {
                    title: movieTitle.value,
                    year: movieYear.value,
                    imdbRating: movieRating.value,
                    genre: movieGenre.value,
                    poster: moviePoster.src,
                };

                const response = await axios.post('/movies', movie);
                if (response.status === 200) {
                    alert('Movie added to database successfully');
                     // Reset form fields when movie is added
                    movieTitle.value = '';
                    movieYear.value = '';
                    movieRating.value = '';
                    movieGenre.value = '';
                    moviePoster.src = '';
                    moviePoster.style.display = 'none';

                    //Reopen homepage
                    window.location.href = '/index.html';
                } else {
                    alert('Error adding movie');
                }
            } catch (error) {
                alert('Error adding movie: ' + error);
            }
            if (movieList) {
                getMovies();
            }
        });
    }

    // Get all movies
    async function getMovies() {
        try {
            const response = await axios.get('/movies');
            console.log(response.data);
            if (response.status === 200) {
                const movies = response.data;
                movieList.innerHTML = ''; 
                movies.forEach(movie => {
                    const movieItem = document.createElement('div');
                    movieItem.className = 'movie-item';
                    movieItem.innerHTML = `
                        <h3>${movie.title}</h3>
                        <p>Year: ${movie.year}</p>
                        <p>IMDB Rating: ${movie.imdbRating}</p>
                        <p>Genre: ${movie.genre}</p>
                        <img src="${movie.poster}" alt="${movie.title}" style="width: 100px;">
                    `;
                    movieList.appendChild(movieItem);
                });
            } else {
                alert('Error fetching movies');
            }
        } catch (error) {
            alert('Error fetching movies: ' + error);
        }
    }

    if (movieList) {
        getMovies();
    }
});
