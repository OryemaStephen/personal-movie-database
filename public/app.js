const apiUrl = `http://www.omdbapi.com/?apikey=6698f446&t`;
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navBar = document.getElementById('navbar');
    //Navigation menu
    //Display or hide nav items and hamburger
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
    };

    hamburger.addEventListener('click', toggleNavMenu);

    // Initial Nav state
    function initialNavState(){
        if (window.innerWidth <= 768) {
            navBar.style.display = 'none';
            hamburger.classList.add('fa-bars');
        } else {
            navBar.style.display = 'flex';
            hamburger.classList.remove('fa-bars', 'fa-times');
        }
    };

    initialNavState();
    window.addEventListener('resize', initialNavState);

    //Footer
    const year = document.getElementById('year');
    const date = new Date();
    year.innerHTML = date.getFullYear();

    //Request data
    //Access input fields
    const title = document.getElementById('search-movie');
    const movieTitle = document.getElementById('movie-title');
    const movieYear = document.getElementById('movie-year');
    const movieRating = document.getElementById('movie-rating');
    const moviePoster = document.getElementById('movie-poster');

    //Get movie from api based on search text
    title.addEventListener('change', async function getData(){
        try{
            const response = await axios.get(`http://www.omdbapi.com/?apikey=6698f446&t=${title.value}`);
            if (response.data.Response === "True") {
                const movie = response.data;
                console.log(movie)
                movieTitle.value = movie.Title;
                movieYear.value = movie.Year;
                moviePoster.src = movie.Poster;
                moviePoster.style.display = 'block';
                movieRating.value = movie.imdbRating;
            } else {
                alert('Movie not found:', response.data.Error);
                movieTitle.value = '';
                movieYear.value = '';
                movieRating.value = '';
                moviePoster.src = '';
                moviePoster.style.display = 'none';
            }
        } catch (error) {
            alert('Error fetching movie details:', error);
            movieTitle.value = '';
            movieYear.value = '';
            movieRating.value = '';
            moviePoster.src = '';
            moviePoster.style.display = 'none';

        }
    })
});
