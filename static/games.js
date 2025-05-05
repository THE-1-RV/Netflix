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

    // Handle horizontal scroll for game sliders with smooth scrolling
    const sliders = document.querySelectorAll('.games-slider');
    
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

    // Enhanced hover effects for game cards
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add a slight delay before showing info for smoother effect
            setTimeout(() => {
                const info = this.querySelector('.game-info');
                if (info) {
                    info.style.transform = 'translateY(0)';
                }
            }, 50);
        });
        
        card.addEventListener('mouseleave', function() {
            const info = this.querySelector('.game-info');
            if (info) {
                info.style.transform = 'translateY(70%)';
            }
        });
    });

    // Button interactions
    const infoButtons = document.querySelectorAll('.card-btn:first-child');
    const installButtons = document.querySelectorAll('.install-btn, .card-btn:nth-child(2)');
    const downloadButton = document.querySelector('.download-button');
    const learnMoreButton = document.querySelector('.learn-more-button');
    
    infoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Info button clicked');
            // Animation effect when clicked
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    installButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Install button clicked');
            // Change text to indicate installing/installed
            if (this.innerHTML.includes('Install') || this.innerHTML.includes('fa-download')) {
                if (this.classList.contains('card-btn')) {
                    // If it's the small round button
                    const icon = this.querySelector('i');
                    icon.classList.remove('fa-download');
                    icon.classList.add('fa-check');
                } else {
                    // If it's the regular install button
                    this.innerHTML = '<i class="fas fa-check"></i> Installed';
                }
                // Animation
                this.style.background = '#46d369';
                this.style.borderColor = '#46d369';
            } else {
                if (this.classList.contains('card-btn')) {
                    // If it's the small round button
                    const icon = this.querySelector('i');
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-download');
                } else {
                    // If it's the regular install button
                    this.innerHTML = '<i class="fas fa-download"></i> Install';
                }
                // Animation
                this.style.background = this.classList.contains('card-btn') ? 'rgba(0, 0, 0, 0.5)' : '#e50914';
                this.style.borderColor = this.classList.contains('card-btn') ? '#fff' : '#e50914';
            }
            
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            console.log('Download button clicked');
            // Animation effect when clicked
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', function() {
            console.log('Learn more button clicked');
            // Animation effect when clicked
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }

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

    // Simulated loading of game content (visual enhancement)
    function fadeInGames() {
        const rows = document.querySelectorAll('.games-row');
        
        rows.forEach((row, index) => {
            setTimeout(() => {
                row.style.opacity = '1';
            }, 100 * index);
        });
    }
    
    // Initial loading animation
    setTimeout(fadeInGames, 500);
}); 