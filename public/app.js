document.addEventListener('DOMContentLoaded', () => {
    // Access elements
    const hamburger = document.getElementById('hamburger');
    const navBar = document.getElementById('navbar');
    const movieList = document.getElementById('movie-list');
    const searchText = document.getElementById('search-movie');
    const movieTitle = document.getElementById('movie-title');
    const movieYear = document.getElementById('movie-year');
    const movieRating = document.getElementById('movie-rating');
    const moviePoster = document.getElementById('movie-poster');
    const movieGenre = document.getElementById('movie-genre');
    const addMovieButton = document.getElementById('add-movie-btn');
    const filterMovie = document.getElementById('filter-movie');
    const movieSort = document.getElementById('movie-sort');

    // Highlighting menu item on click
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Toggle menu hamburger
    function toggleNavMenu() {
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

    function initialNavState() {
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

    // Add year in footer
    const year = document.getElementById('year');
    if (year) {
        const date = new Date();
        year.innerHTML = date.getFullYear();
    }

    // Search movie from API based on the title
    const apiKey = '6698f446';
    const apiUrl = 'https://www.omdbapi.com/';

    async function searchMovies() {
        const searchTextValue = searchText.value;
        if (searchTextValue.length < 1) {
            document.getElementById('search-results').innerHTML = '';
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}?s=${searchTextValue}&apikey=${apiKey}`);
            if (response.data.Response === 'True') {
                displayMovies(response.data.Search);
            } else {
                document.getElementById('search-results').innerHTML = '';
            }
        } catch (error) {
            console.error('Error fetching movie list:', error);
        }
    }

    if (searchText) {
        searchText.addEventListener('input', searchMovies);
    }

    function displayMovies(movies) {
        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = '';

        movies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.textContent = `${movie.Title}-${movie.Year}`;
            listItem.onclick = () => selectMovie(movie.imdbID);
            searchResults.appendChild(listItem);
        });
    }

    async function selectMovie(imdbID) {
        try {
            const response = await axios.get(`${apiUrl}?i=${imdbID}&apikey=${apiKey}`);
            if (response.data.Response === 'True') {
                const movie = response.data;
                movieTitle.value = movie.Title;
                movieYear.value = movie.Year;
                movieGenre.value = movie.Genre;
                movieRating.value = movie.imdbRating;
                moviePoster.src = movie.Poster;
                moviePoster.style.display = 'block';
                document.getElementById('search-results').innerHTML = '';
            } else {
                alert('Movie not found: ' + response.data.Error);
                clearForm();
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
            clearForm();
        }
    }

    function clearForm() {
        movieTitle.value = '';
        movieYear.value = '';
        movieGenre.value = '';
        movieRating.value = '';
        moviePoster.src = '';
        moviePoster.style.display = 'none';
    }

    // Function to check if a movie exists in the database
    async function checkMovieExists(title, year) {
        try {
            const response = await axios.get('/movies');
            if (response.status === 200) {
                const movies = response.data;
                return movies.some(movie => movie.title === title && movie.year === year);
            } else {
                throw new Error('Error fetching movies');
            }
        } catch (error) {
            console.error('Error checking movie existence:', error);
            return false;
        }
    }

    // Add movie to the database
    addMovieButton?.addEventListener('click', async function addMovie(event) {
        event.preventDefault();

        const title = movieTitle.value;
        const year = movieYear.value;

        // Check if movie already exists
        const exists = await checkMovieExists(title, year);
        if (exists) {
            alert('Movie already exists in the database');
            return;
        }

        try {
            const movie = {
                title: title,
                year: year,
                imdbRating: movieRating.value,
                genre: movieGenre.value,
                poster: moviePoster.src,
            };

            const response = await axios.post('/movies', movie);
            if (response.status === 200) {
                alert('Movie added successfully');
                clearForm();
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

    // Get top 10 movies
    const numberOfMovies = 10;
    async function getTop10Movies() {
        try {
            const response = await axios.get('/movies');
            if (response.status === 200) {
                const movies = response.data;
                movieList.innerHTML = '';
                movies.forEach((movie, index) => {
                    if (index < numberOfMovies) {
                        const movieItem = document.createElement('div');
                        movieItem.className = 'movie-item';
                        movieItem.innerHTML = `
                            <div class="poster-div">
                                <img class="poster" src="${movie.poster}" alt="${movie.title}">
                            </div>
                            <div class="movie-details">
                                <h3 class="title">${movie.title}</h3>
                                <div class="movie-label">
                                    <span class="year">${movie.year}</span>
                                    <span class="genre">${movie.genre.split(',')[0]}</span>
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

    // Get all movies
    const loadMovieButton = document.getElementById('load-movie-button');
    async function getAllMovies() {
        try {
            const response = await axios.get('/movies');
            if (response.status === 200) {
                const movies = response.data;
                movieList.innerHTML = '';
                movies.forEach(movie => {
                    const movieItem = document.createElement('div');
                    movieItem.className = 'movie-item';
                    movieItem.innerHTML = `
                        <div class="poster-div">
                            <img class="poster" src="${movie.poster}" alt="${movie.title}">
                        </div>
                        <div class="movie-details">
                            <h3 class="title">${movie.title}</h3>
                            <div class="movie-label">
                                <span class="year">${movie.year}</span>
                                <span class="genre">${movie.genre.split(',')[0]}</span>
                                <button data-id="${movie.id}" type="button" class="delete-movie">Delete</button>
                                <span class="rating"><span>&#9733;</span> ${movie.imdbRating}</span>
                            </div>
                        </div>
                    `;
                    movieList.appendChild(movieItem);
                });
                // Load delete function
                deleteItem();
                // Hide load button
                loadMovieButton.style.display = 'none';
            } else {
                alert('Error fetching movies');
            }
        } catch (error) {
            alert('Error fetching movies: ' + error);
        }
    }

    if (movieList && loadMovieButton) {
        loadMovieButton.addEventListener('click', getAllMovies);
    }

    // Delete movie
    function deleteItem() {
        const deleteButtons = document.querySelectorAll('.delete-movie');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const movieId = this.getAttribute('data-id');
                const isConfirmed = confirm('Are you sure you want to delete this movie?');
                if (isConfirmed) {
                    try {
                        const response = await axios.delete(`/movies/${movieId}`);
                        if (response.status === 200) {
                            alert('Movie deleted successfully');
                            getAllMovies();
                        } else {
                            alert('Error deleting movie');
                        }
                    } catch (error) {
                        alert('Error deleting movie: ' + error);
                    }
                } else {
                    alert('Movie deletion cancelled');
                }
            });
        });
    }

    // Filter movies based on title, year, and genre
    function filterMovies() {
        const filterText = filterMovie.value.toLowerCase();
        const movieItems = document.querySelectorAll('.movie-item');

        movieItems.forEach(movieItem => {
            const title = movieItem.querySelector('.title').textContent.toLowerCase();
            const year = movieItem.querySelector('.year').textContent.toLowerCase();
            const genre = movieItem.querySelector('.genre').textContent.toLowerCase();

            if (title.includes(filterText) || year.includes(filterText) || genre.includes(filterText)) {
                movieItem.style.display = 'block';
            } else {
                movieItem.style.display = 'none';
            }
        });
    }

    if (filterMovie) {
        filterMovie.addEventListener('input', filterMovies);
    }

    // Sort movies based on the selected sort option
    function sortItems() {
        const sortOrder = movieSort.value;
        const items = Array.from(movieList.children);

        items.sort((a, b) => {
            const titleA = a.querySelector('.title').textContent.toLowerCase();
            const titleB = b.querySelector('.title').textContent.toLowerCase();

            switch (sortOrder) {
                case 'ascending':
                    return titleA.localeCompare(titleB);
                case 'descending':
                    return titleB.localeCompare(titleA);
                default:
                    return 0;
            }
        });

        movieList.innerHTML = '';
        items.forEach(item => movieList.appendChild(item));
    }

    if (movieSort) {
        movieSort.addEventListener('change', sortItems);
    }
});