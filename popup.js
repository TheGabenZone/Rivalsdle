function showDifficultyPopup(gameType) {
    const popup = document.getElementById('difficultyPopup');
    popup.style.display = 'flex';
    
    // Store the game type for later use
    popup.setAttribute('data-game-type', gameType);
}

function initializeDifficultyButtons() {
    const sideLights = document.getElementById('sideLights');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    
    difficultyButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            sideLights.className = 'side-light ' + button.dataset.difficulty;
            sideLights.style.opacity = '1';
        });
        
        button.addEventListener('mouseleave', () => {
            sideLights.style.opacity = '0';
        });
        
        button.addEventListener('click', () => {
            const gameType = document.getElementById('difficultyPopup').getAttribute('data-game-type');
            const difficulty = button.dataset.difficulty;
            startGame(gameType, difficulty);
        });
    });
}

function startGame(gameType, difficulty) {
    // If it's a character game, redirect to the character game page
    if (gameType === 'character') {
        window.location.href = `./characters/index.html?difficulty=${difficulty}`;
    } else {
        console.log(`Starting ${gameType} game on ${difficulty} difficulty`);
    }
    document.getElementById('difficultyPopup').style.display = 'none';
}

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
    initializeDifficultyButtons();
    
    // Add click handlers to game buttons
    document.querySelectorAll('.game-button').forEach(button => {
        button.addEventListener('click', () => {
            showDifficultyPopup(button.getAttribute('data-lang'));
        });
    });
});

function updateDifficultyTexts() {
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(button => {
        const difficulty = button.dataset.difficulty;
        button.textContent = languages[currentLanguage].difficulties[difficulty];
    });
}

// Add this new function
function closeDifficultyPopup() {
    const popup = document.getElementById('difficultyPopup');
    popup.style.display = 'none';
}

// Add event listener for Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeDifficultyPopup();
    }
});