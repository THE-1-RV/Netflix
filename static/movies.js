// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar background change on scroll
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Handle horizontal scroll for movie sliders with smooth scrolling
    const sliders = document.querySelectorAll('.movies-slider');
    
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    });

    // Enhanced hover effects for movie cards
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add a slight delay before showing info for smoother effect
            setTimeout(() => {
                const info = this.querySelector('.movie-info');
                if (info) {
                    info.style.transform = 'translateY(0)';
                }
            }, 50);
        });
        
        card.addEventListener('mouseleave', function() {
            const info = this.querySelector('.movie-info');
            if (info) {
                info.style.transform = 'translateY(100%)';
            }
        });
    });

    // Button interactions
    const playButtons = document.querySelectorAll('.play-button, .card-btn:first-child');
    const infoButton = document.querySelector('.more-info-button');
    const addListButtons = document.querySelectorAll('.add-list-button, .card-btn:nth-child(2)');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Play button clicked');
            // Animation effect when clicked
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    if (infoButton) {
        infoButton.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('More info button clicked');
            // Animation effect when clicked
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    addListButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Add to list button clicked');
            // Toggle plus/check icon to simulate adding/removing from list
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-plus')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-check');
                // Animation
                this.style.background = '#46d369';
                this.style.borderColor = '#46d369';
            } else {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-plus');
                // Animation
                this.style.background = 'rgba(0, 0, 0, 0.5)';
                this.style.borderColor = '#fff';
            }
            
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    // Search bar functionality
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#e50914';
        });
        
        searchBar.addEventListener('blur', function() {
            this.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        searchBar.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                console.log('Searching for:', this.value);
                this.value = '';
            }
        });
    }

    // Simulated loading of movie content (visual enhancement)
    function fadeInMovies() {
        const rows = document.querySelectorAll('.movies-row');
        
        rows.forEach((row, index) => {
            setTimeout(() => {
                row.style.opacity = '1';
            }, 100 * index);
        });
    }
    
    // Initial loading animation
    setTimeout(fadeInMovies, 500);
}); 