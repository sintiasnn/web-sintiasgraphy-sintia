const menuToggle = document.querySelector('.menu-toggle input');
const nav = document.querySelector('nav ul');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
        nav.classList.toggle('slide');
    });
}