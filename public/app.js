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
        const title = document.getElementById('search-movie');
        title.addEventListener('change', async function getData(){
            const response = await axios.get(`http://www.omdbapi.com/?apikey=6698f446&t=${title.value}`);
            console.log(response.data);
        })
});
