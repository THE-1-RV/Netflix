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