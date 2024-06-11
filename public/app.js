document.addEventListener('DOMContentLoaded', ()=>{
    const hamburger = document.getElementById('hamburger');
    const navBar = document.getElementById('navbar');

    hamburger.addEventListener('click', ()=> {
        if (hamburger.classList.contains('fa-bars')) {
            hamburger.classList.remove('fa-bars');
            hamburger.classList.add('fa-times');
            navBar.style.display = 'block';
        } else {
            hamburger.classList.remove('fa-times');
            hamburger.classList.add('fa-bars');
            navBar.style.display = 'none';
        }
    });
})