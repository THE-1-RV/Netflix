// Featured Video Controls
const featuredVideo = document.getElementById('featured-video');
const muteBtnFeatured = document.getElementById('mute-btn-featured');
const muteIconFeatured = document.getElementById('mute-icon-featured');

// Fetch TV Shows Data
async function fetchTVShows(category) {
    try {
        const response = await fetch(`/api/tv-shows/${category}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${category} TV shows:`, error);
        return [];
    }
}

// Create Show Card Element
function createShowCard(show) {
    const card = document.createElement('div');
    card.className = 'show-card';
    
    const badges = document.createElement('div');
    badges.className = 'show-badges';
    if (show.isTop10) {
        badges.innerHTML += '<span class="badge top10">TOP 10</span>';
    }
    if (show.isNew) {
        badges.innerHTML += '<span class="badge new">NEW</span>';
    }
    
    card.innerHTML = `
        ${badges.outerHTML}
        <img src="${show.image}" alt="${show.title}">
        <div class="show-info">
            <h3 class="show-title">${show.title}</h3>
            <div class="show-meta">
                <span>${show.year}</span>
                <span>${show.rating}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Populate TV Shows Grid
async function populateShowsGrid(category, containerId) {
    const container = document.getElementById(containerId);
    const shows = await fetchTVShows(category);
    
    shows.forEach(show => {
        const card = createShowCard(show);
        container.appendChild(card);
    });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Featured Video Controls (mute button)
    const featuredVideo = document.getElementById('featured-video');
    const muteBtnFeatured = document.getElementById('mute-btn-featured');
    const muteIconFeatured = document.getElementById('mute-icon-featured');
    if (muteBtnFeatured && featuredVideo && muteIconFeatured) {
        muteBtnFeatured.addEventListener('click', () => {
            if (featuredVideo.muted) {
                featuredVideo.muted = false;
                muteIconFeatured.textContent = '🔊';
            } else {
                featuredVideo.muted = true;
                muteIconFeatured.textContent = '🔇';
            }
        });
    }

    // Carousel logic
    fetch('/api/tv-shows/')
        .then(response => response.json())
        .then(data => {
            const shows = data.shows;
            const grid = document.getElementById('popular-shows');
            if (grid) {
                grid.innerHTML = '';
                shows.forEach((show, idx) => {
                    const card = document.createElement('span');
                    card.className = 'movieslist';
                    card.innerHTML = `
                        <img src="${show.image}" alt="${show.title}" style="width:100%;height:180px;object-fit:cover;border-radius:10px;">
                        <div style="color:white;text-align:center;font-weight:bold;margin-top:8px;">${show.title}</div>
                    `;
                    grid.appendChild(card);
                });
            }
        });

    // Play trailer logic for hero section
    const playBtn = document.getElementById('play-trailer-btn');
    const heroImage = document.getElementById('hero-image');
    const heroVideo = document.getElementById('hero-video');
    const trailerSpinner = document.getElementById('trailer-spinner');

    if (playBtn && heroImage && heroVideo && trailerSpinner) {
        playBtn.addEventListener('click', async function() {
            // Always fetch and play the latest trailer from API
            playBtn.disabled = true;
            trailerSpinner.style.display = 'inline-block';
            playBtn.textContent = "Loading...";
            const url = 'https://imdb232.p.rapidapi.com/api/title/get-top-trending-video-trailers?limit=70';
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '7103fdad2cmshd7bff10aab75033p18923djsn1b1ee55b8181',
                    'x-rapidapi-host': 'imdb232.p.rapidapi.com'
                }
            };
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                let trailerUrl = null;
                if (data && data.results && data.results.length > 0) {
                    for (const item of data.results) {
                        if (item.trailer && item.trailer.link) {
                            trailerUrl = item.trailer.link;
                            break;
                        }
                        if (item.video && item.video.link) {
                            trailerUrl = item.video.link;
                            break;
                        }
                    }
                }
                if (trailerUrl) {
                    heroImage.style.display = 'none';
                    heroVideo.style.display = 'block';
                    heroVideo.setAttribute('controls', 'controls');
                    while (heroVideo.firstChild) heroVideo.removeChild(heroVideo.firstChild);
                    heroVideo.src = trailerUrl;
                    heroVideo.load();
                    heroVideo.play();
                } else {
                    heroVideo.style.display = 'none';
                    heroImage.style.display = 'block';
                    alert('No trailer found!');
                }
            } catch (err) {
                heroVideo.style.display = 'none';
                heroImage.style.display = 'block';
                alert('Failed to load trailer.');
            } finally {
                playBtn.disabled = false;
                playBtn.textContent = "Play";
                trailerSpinner.style.display = 'none';
            }
        });
    }

    // Navbar background change on scroll
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Handle horizontal scroll for show sliders with smooth scrolling
    const sliders = document.querySelectorAll('.shows-slider');
    
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

    // Enhanced hover effects for show cards
    const showCards = document.querySelectorAll('.show-card');
    
    showCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add a slight delay before showing info for smoother effect
            setTimeout(() => {
                const info = this.querySelector('.show-info');
                if (info) {
                    info.style.transform = 'translateY(0)';
                }
            }, 50);
        });
        
        card.addEventListener('mouseleave', function() {
            const info = this.querySelector('.show-info');
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

    // Simulated loading of show content (visual enhancement)
    function fadeInShows() {
        const rows = document.querySelectorAll('.shows-row');
        
        rows.forEach((row, index) => {
            setTimeout(() => {
                row.style.opacity = '1';
            }, 100 * index);
        });
    }
    
    // Initial loading animation
    setTimeout(fadeInShows, 500);
}); 