// Placeholder for Netflix main page interactivity

// Mute/unmute trailer video
const trailerVideo = document.getElementById('trailer-video');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');

function updateMuteIcon() {
  if (trailerVideo.muted) {
    muteIcon.textContent = '🔇';
    muteBtn.setAttribute('aria-label', 'Unmute');
  } else {
    muteIcon.textContent = '🔊';
    muteBtn.setAttribute('aria-label', 'Mute');
  }
}

if (trailerVideo && muteBtn && muteIcon) {
  // Set initial icon state
  updateMuteIcon();
  muteBtn.addEventListener('click', function() {
    trailerVideo.muted = !trailerVideo.muted;
    updateMuteIcon();
  });
}

// Mute/unmute trailer video (NEW BUTTON)
const muteBtnFixed = document.getElementById('mute-btn-fixed');
const muteIconFixed = document.getElementById('mute-icon-fixed');

function updateMuteIconFixed() {
  if (trailerVideo.muted) {
    muteIconFixed.textContent = '🔇';
    muteBtnFixed.setAttribute('aria-label', 'Unmute');
  } else {
    muteIconFixed.textContent = '🔊';
    muteBtnFixed.setAttribute('aria-label', 'Mute');
  }
}

if (trailerVideo && muteBtnFixed && muteIconFixed) {
  updateMuteIconFixed();
  muteBtnFixed.addEventListener('click', function() {
    trailerVideo.muted = !trailerVideo.muted;
    updateMuteIconFixed();
  });
}

// Existing Play/Info button handlers
if (document.querySelector('.play-btn')) {
  document.querySelector('.play-btn').addEventListener('click', function() {
    alert('Play button clicked! (Trailer functionality coming soon)');
  });
}
if (document.querySelector('.info-btn')) {
  document.querySelector('.info-btn').addEventListener('click', function() {
    alert('More Info button clicked! (Show details coming soon)');
  });
}

function createBadge(badge) {
  let badgeClass = '';
  if (badge.toLowerCase().includes('top 10')) badgeClass = 'top10';
  if (badge.toLowerCase().includes('new')) badgeClass = 'new';
  if (badge.toLowerCase().includes('recently')) badgeClass = 'recent';
  return `<div class="badge ${badgeClass}">${badge}</div>`;
}

function renderCarousels(carousels) {
  const container = document.getElementById('dynamic-carousels');
  container.innerHTML = '';
  carousels.forEach(section => {
    const sectionElem = document.createElement('section');
    sectionElem.className = 'carousel-section';
    const titleElem = document.createElement('h2');
    titleElem.className = 'carousel-title';
    titleElem.textContent = section.title;
    sectionElem.appendChild(titleElem);
    const rowElem = document.createElement('div');
    rowElem.className = 'carousel-row';
    section.items.forEach(item => {
      const cardElem = document.createElement('div');
      cardElem.className = 'carousel-card';
      const imgElem = document.createElement('img');
      imgElem.src = item.image;
      imgElem.alt = item.title;
      imgElem.crossOrigin = 'anonymous';
      cardElem.appendChild(imgElem);
      // Movie title below image
      const movieTitleElem = document.createElement('div');
      movieTitleElem.className = 'movie-title';
      movieTitleElem.textContent = item.title;
      cardElem.appendChild(movieTitleElem);
      (item.badges || []).forEach(badge => {
        cardElem.insertAdjacentHTML('beforeend', createBadge(badge));
      });
      rowElem.appendChild(cardElem);
    });
    sectionElem.appendChild(rowElem);
    container.appendChild(sectionElem);
  });
}

fetch('http://127.0.0.1:5000/api/carousels')
  .then(res => res.json())
  .then(renderCarousels)
  .catch(err => {
    document.getElementById('dynamic-carousels').innerHTML = '<p style="color:red;">Failed to load carousels.</p>';
    console.error(err);
  }); 