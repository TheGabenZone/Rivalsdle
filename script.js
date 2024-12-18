function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        createStar(starsContainer);
    }
}

function createStar(container) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Position the star
    repositionStar(star);
    
    // Add animation end listener
    star.addEventListener('animationiteration', () => {
        repositionStar(star);
    });
    
    container.appendChild(star);
}

function repositionStar(star) {
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    const size = Math.random() * 2 + 1;  // Slightly smaller size range
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    star.style.animationDelay = `${Math.random() * 4}s`;  // Longer delay range
}

// Initialize stars when the page loads
document.addEventListener('DOMContentLoaded', createStars);

// Add this to the end of your existing script.js
let currentLanguage = 'en';

function changeLanguage(lang) {
    currentLanguage = lang;
    updateTexts();
}

function updateTexts() {
    // Update title
    document.querySelector('[data-lang="title"]').textContent = languages[currentLanguage].title;
    
    // Update buttons
    const buttons = document.querySelectorAll('.game-button');
    buttons.forEach(button => {
        const key = button.getAttribute('data-lang');
        button.textContent = languages[currentLanguage].buttons[key];
    });
    
    // Update credits
    document.querySelector('[data-lang="credits"]').textContent = languages[currentLanguage].credits;

    // Update difficulty popup title
    document.querySelector('[data-lang="selectDifficulty"]').textContent = languages[currentLanguage].selectDifficulty;

    updateDifficultyTexts();
}

let youtubeChat;

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    updateTexts();
    
    // Initialize YouTube Chat
    youtubeChat = new YouTubeChat();
    
    // Add click handler for online mode button
    const onlineButton = document.querySelector('.online-mode-button');
    onlineButton.addEventListener('click', (e) => {
        e.stopPropagation();
        youtubeChat.connect();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize YouTube Chat globally
    if (!window.youtubeChat) {
        window.youtubeChat = new YouTubeChat();
    }

    // If we're on a game page and online mode is enabled, start in unlimited mode
    if (window.location.pathname.includes('/characters/') && window.youtubeChat.isConnected) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('difficulty', 'unlimited');
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    }
});

// Add beforeunload event listener to maintain chat connection
window.addEventListener('beforeunload', () => {
    if (window.youtubeChat && window.youtubeChat.isConnected) {
        localStorage.setItem('youtubeChat_connected', 'true');
    }
});