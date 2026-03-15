// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.custom-navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});