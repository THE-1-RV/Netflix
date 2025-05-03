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

// Initialize the page
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
                    'x-rapidapi-key': '4e9afe57acmsha5e22d76629d6bcp1720f3jsn996f27c7fa5f',
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

    // Show card click logic (optional)
    document.addEventListener('click', (e) => {
        const showCard = e.target.closest('.show-card');
        if (showCard) {
            const showTitle = showCard.querySelector('.show-title').textContent;
            // Here you can implement navigation to the show details page
            console.log(`Clicked on show: ${showTitle}`);
        }
    });
}); 