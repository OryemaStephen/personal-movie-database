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
    
    // Toggle menu hamburger
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
                getTop10Movies();
            }
        });
    }

    // Get all movies
    const numberOfMovies = 10;
    async function getTop10Movies() {
        try {
            const response = await axios.get('/movies');
            if (response.status === 200) {
                const movies = response.data;
                movieList.innerHTML = ''; 
                movies.forEach((movie,index) => {
                    if(index<numberOfMovies){
                        const movieItem = document.createElement('div');
                        movieItem.className = 'movie-item';
                        movieItem.innerHTML = `
                            <img class="poster" src="${movie.poster}" alt="${movie.title}">
                            <div class="movie-details">
                                <h3 class="title">${movie.title}</h3>
                                <div class="movie-label">
                                    <span class="year"> ${movie.year}</span>
                                    <span class="genre"> ${movie.genre.split(',')[0]}</span>
                                    <button data-id="${movie.id}" type="button" class="delete-movie">Delete</button>
                                    <span class="rating"><span>&#9733;</span> ${movie.imdbRating}</span>
                                </div>
                            </div>                        
                        `;
                        movieList.appendChild(movieItem);
                    }
                });
                deleteItem();
            } else {
                alert('Error fetching movies');
            }
        } catch (error) {
            alert('Error fetching movies: ' + error);
        }
    }

    if (movieList) {
        getTop10Movies();
    }

    //Get All movies
    const loadMovieButton = document.getElementById('load-movie-button');
    async function getAllMovies() {
        try {
            const response = await axios.get('/movies');
            if (response.status === 200) {
                const movies = response.data;
                movieList.innerHTML = ''; 
                movies.forEach((movie) => {
                    const movieItem = document.createElement('div');
                    movieItem.className = 'movie-item';
                    movieItem.innerHTML = `
                        <img class="poster" src="${movie.poster}" alt="${movie.title}">
                        <div class="movie-details">
                            <h3 class="title">${movie.title}</h3>
                            <div class="movie-label">
                                <span class="year"> ${movie.year}</span>
                                <span class="genre"> ${movie.genre.split(',')[0]}</span>
                                <button data-id="${movie.id}" type="button" class="delete-movie">Delete</button>
                                <span class="rating"><span>&#9733;</span> ${movie.imdbRating}</span>
                            </div>
                        </div>                        
                    `;
                    movieList.appendChild(movieItem);
                });
                deleteItem();
            } else {
                alert('Error fetching movies');
            }
        } catch (error) {
            alert('Error fetching movies: ' + error);
        }
    }

    if (movieList) {
        loadMovieButton.addEventListener('click', getAllMovies);
    }

    //Delete movie
     function deleteItem() {
        //Access delete buttons
        const deleteButtons = document.querySelectorAll('.delete-movie');

        //Access the movie with the clicked delete button
        deleteButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const movieId = this.getAttribute('data-id');
                const isConfirmed = confirm('Are you sure you want to delete this movie?');

                //Delete movie when user clicked ok for the confirm prompt
                if(isConfirmed){
                    try {
                        const response = await axios.delete(`/movies/${movieId}`);
                        if (response.status === 200) {
                            alert('Movie deleted successfully');
                            // Refresh the movie list after deletion
                            getAllMovies();
                        } else {
                            alert('Error deleting movie');
                        }
                    } catch (error) {
                        alert('Error deleting movie: ' + error);
                    }
                } else{
                    alert('Movie deletion cancelled')
                }
                
            });
        });
    }    
});
