document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function(navLink) {
        navLink.addEventListener('click', function(event) {
            event.preventDefault();

            const pageURL = this.getAttribute('data-page');
            fetch(pageURL)
                .then(response => response.text())
                .then(html => {
                    document.getElementById('content-container').innerHTML = html;
                })
                .catch(error => console.error('Error fetching page:', error));
        });
    });
});
