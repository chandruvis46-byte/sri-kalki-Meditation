console.log("Sri Kalki Meditation App Loaded");

// Music Player Elements
const musicPlayer = document.getElementById('musicPlayer');
const closePlayerBtn = document.getElementById('closePlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.getElementById('progressFill');
const miracleCards = document.querySelectorAll('.miracle-card');

// Player state
let isPlaying = false;
let currentProgress = 20; // Starting at 20% as shown in design

// Open music player when clicking on any miracle card
miracleCards.forEach(card => {
    card.addEventListener('click', () => {
        musicPlayer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when player is open
    });
});

// Close music player
closePlayerBtn.addEventListener('click', () => {
    musicPlayer.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
});

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
});

// Progress bar click functionality
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    currentProgress = percentage;
    progressFill.style.width = percentage + '%';

    // Update time based on percentage (7:30 total = 450 seconds)
    const totalSeconds = 450;
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    document.getElementById('currentTime').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// Close player when clicking outside (on the background)
musicPlayer.addEventListener('click', (e) => {
    if (e.target === musicPlayer) {
        musicPlayer.classList.remove('active');
        document.body.style.overflow = '';
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
});
