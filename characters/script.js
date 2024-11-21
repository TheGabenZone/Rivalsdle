class CharacterGame {
    constructor(difficulty) {
        this.difficulty = difficulty;
        this.lives = this.getInitialLives();
        this.currentCharacter = null;
        this.shownKeywords = 0; // For hard difficulty keywords
        this.correctGuesses = 0; // For unlimited mode
        this.chatInterval = null;

        this.userColors = new Map(); // Store username -> color mapping
        this.availableColors = [
            '#FF69B4', // Pink
            '#00FF00', // Lime
            '#00FFFF', // Cyan
            '#FFD700', // Gold
            '#FF4500', // Orange Red
            '#9370DB', // Medium Purple
            '#32CD32', // Lime Green
            '#FF69B4', // Hot Pink
            '#4169E1', // Royal Blue
            '#FF8C00'  // Dark Orange
        ];

        this.initializeGame();
    }

    getInitialLives() {
        switch (this.difficulty) {
            case 'easy': return 3;
            case 'medium': return 6;
            case 'hard': return 9;
            case 'unlimited': return 5;
            default: return 3;
        }
    }

    async initializeGame() {
        if (this.difficulty === 'unlimited') {
            await this.loadNextUnlimitedCharacter();
        } else {
            // Get today's character based on UTC midnight
            this.currentCharacter = await this.getTodaysCharacter();
    
            // Check if game is already completed
            const completedGame = this.checkDailyAttempt();
    
            this.setupUI();
    
            if (completedGame) {
                // Show original image if game is completed
                const img = document.getElementById('character-image');
                img.src = `../characters/images/${this.currentCharacter.toLowerCase().replace(/ /g, '_')}.png`;
            } else {
                // Apply difficulty effects for new game
                this.applyDifficultyEffects();
            }
        }
    }

    async getTodaysCharacter() {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const seed = today.getTime() + this.difficulty.charCodeAt(0);
        const randomIndex = this.seededRandom(seed, charactersList.length);
        return charactersList[randomIndex];
    }

    seededRandom(seed, max) {
        const x = Math.sin(seed++) * 10000;
        return Math.floor((x - Math.floor(x)) * max);
    }

    setupUI() {
        const completedGame = this.checkDailyAttempt();

        if (completedGame) {
            // Show completed game UI
            this.setupCompletedGameUI();
        } else {
            // Show normal game UI
            this.setupSearchBox();
            this.updateLives();
            this.loadCharacterImage();
        }
    }

    setupCompletedGameUI() {
        // Remove search container and lives container
        const searchContainer = document.querySelector('.search-container');
        const livesContainer = document.querySelector('.lives-container');
        if (searchContainer) searchContainer.remove();
        if (livesContainer) livesContainer.remove();

        // Show original image
        const img = document.getElementById('character-image');
        img.src = `../characters/images/${this.currentCharacter.toLowerCase().replace(/ /g, '_')}.png`;

        // Add return to menu button
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        const returnButton = document.createElement('button');
        returnButton.className = 'game-over-modal button';
        returnButton.textContent = 'Return to Main Menu';
        returnButton.onclick = () => window.location.href = '../index.html';
        buttonContainer.appendChild(returnButton);

        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(buttonContainer);
    }

    setupSearchBox() {
        const searchBox = document.getElementById('character-search');
        const resultsBox = document.getElementById('search-results');

        searchBox.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            if (value.length < 2) {
                resultsBox.style.display = 'none';
                return;
            }

            const matches = charactersList.filter(char =>
                char.toLowerCase().includes(value)
            );

            this.displaySearchResults(matches);
        });
    }

    displaySearchResults(matches) {
        const resultsBox = document.getElementById('search-results');
        resultsBox.innerHTML = '';
        resultsBox.style.display = matches.length ? 'block' : 'none';

        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.textContent = match;
            div.addEventListener('click', () => this.makeGuess(match));
            resultsBox.appendChild(div);
        });
    }

    async loadCharacterImage() {
        const img = document.getElementById('character-image');
        
        // Reset any existing transformations
        img.style.transform = 'none';
        img.style.transformOrigin = 'center center';
        
        // Apply effects first if game is not completed
        if (!this.checkDailyAttempt()) {
            this.applyDifficultyEffects();
        }
        
        // Then set the image source
        const imagePath = `../characters/images/${this.currentCharacter.toLowerCase().replace(/ /g, '_')}.png`;
        img.src = imagePath;
        await img.decode(); // Wait for image to load
    }

    applyDifficultyEffects() {
        switch (this.difficulty) {
            case 'easy':
                this.applySilhouette();
                break;
            case 'medium':
                this.applyZoom();
                break;
            case 'hard':
                this.showKeywords();
                break;
        }
    }

    applySilhouette() {
        const img = document.getElementById('character-image');
        img.style.filter = 'saturate(0) brightness(0)';
    }

    applyZoom() {
        const img = document.getElementById('character-image');
        
        // Reset transform and filter first
        img.style.transform = 'none';
        img.style.transformOrigin = 'center';
        img.style.filter = 'none';
        
        // Force a reflow
        void img.offsetWidth;
        
        // Use the same seed as character selection for consistent daily zoom
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const seed = today.getTime() + this.difficulty.charCodeAt(0);
        
        // Define zoom level that ensures ~25% of the image is visible
        const zoomLevel = 8;
        
        // Calculate maximum translation
        const maxTranslateX = (zoomLevel - 1);
        const maxTranslateY = (zoomLevel - 1);
        
        // Generate seeded random positions and rotation
        const translateX = (this.seededRandom(seed, 1000) / 1000) * maxTranslateX - (maxTranslateX / 2);
        const translateY = (this.seededRandom(seed + 1, 1000) / 1000) * maxTranslateY - (maxTranslateY / 2);
        const rotation = (this.seededRandom(seed + 2, 360)); // Random rotation between 0-360 degrees
        
        // Apply transform with rotation and slight delay
        requestAnimationFrame(() => {
            img.style.transform = `scale(${zoomLevel}) translate(${translateX}%, ${translateY}%) rotate(${rotation}deg)`;
            img.style.filter = 'blur(2px)';
        });
    }

    async makeGuess(characterName) {
        if (characterName === this.currentCharacter) {
            if (this.difficulty === 'unlimited') {
                // Increment correct guesses counter
                this.correctGuesses++;
                
                // Get the current difficulty effect
                const img = document.getElementById('character-image');
                const hasKeywords = document.getElementById('keywords-container').children.length > 0;
                const isZoomed = img.style.transform.includes('scale');
                
                // Apply appropriate reveal animation based on current effect
                if (hasKeywords) {
                    await this.handleCorrectGuessHard();
                } else if (isZoomed) {
                    await this.handleCorrectGuessMedium();
                } else {
                    await this.handleCorrectGuess();
                }
                
                // Clear search box
                const searchBox = document.getElementById('character-search');
                searchBox.value = '';
                
                // Load next character
                await this.loadNextUnlimitedCharacter();
            } else {
                if (this.difficulty === 'medium') {
                    this.handleCorrectGuessMedium();
                } else if (this.difficulty === 'hard') {
                    this.handleCorrectGuessHard();
                } else {
                    this.handleCorrectGuess();
                }
            }
        } else {
            this.handleWrongGuess();
        }
    }

    async handleCorrectGuess() {
        // Add the transition class before removing filter
        const img = document.getElementById('character-image');
        img.classList.add('fade-out');
        
        // Remove the silhouette effect with transition
        img.style.filter = 'none';
    
        // Wait for the transition to complete
        await new Promise(resolve => setTimeout(resolve, 500));
    
        // Remove the transition class
        img.classList.remove('fade-out');
    
        // Then update the source to original image
        img.src = `../characters/images/${this.currentCharacter.toLowerCase().replace(/ /g, '_')}.png`;
    
        // Play victory animation after reveal
        await GameAnimations.playVictoryAnimation(this.difficulty);
    
        if(this.difficulty === 'easy') {
            this.saveGameCompletion();
            this.showVictoryModal();
        }
    }

    async handleCorrectGuessMedium() {
        const img = document.getElementById('character-image');
        
        // First remove any filters
        img.classList.add('fade-out');
        img.style.filter = 'none';
        
        // Wait for filter transition
        await new Promise(resolve => setTimeout(resolve, 500));
        img.classList.remove('fade-out');
        
        // Add transition for transform
        img.style.transition = 'transform 0.5s ease-out';
        
        // Reset transform to original position
        img.style.transform = 'none';
        img.style.transformOrigin = 'center';
        
        // Wait for zoom transition
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove transition after zoom
        img.style.transition = '';
        
        // Update to original image
        img.src = `../characters/images/${this.currentCharacter.toLowerCase().replace(/ /g, '_')}.png`;
        
        // Play victory animation after reveal
        await GameAnimations.playVictoryAnimation(this.difficulty);
        
        if(this.difficulty === 'medium') {
            this.saveGameCompletion();
            this.showVictoryModal();
        }
    }

    async handleCorrectGuessHard() {
        // Clear keywords
        const keywordsContainer = document.getElementById('keywords-container');
        keywordsContainer.innerHTML = '';
        
        // Show and reveal the image
        const img = document.getElementById('character-image');
        img.style.display = 'block';
        img.style.transform = 'scale(0.1)';
        img.style.opacity = '0';
        img.style.transition = 'transform 1s ease-out, opacity 0.5s ease-in';
        
        // Force reflow
        void img.offsetWidth;
        
        // Update to original image first
        img.src = `../characters/images/${this.currentCharacter.toLowerCase().replace(/ /g, '_')}.png`;
        
        // Wait for image to load
        await img.decode();
        
        // Start the zoom animation
        img.style.transform = 'scale(1)';
        img.style.opacity = '1';
        
        // Wait for zoom transition
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Play victory animation
        await GameAnimations.playVictoryAnimation('hard');
    
        if(this.difficulty === 'hard') {
            this.saveGameCompletion();
            this.showVictoryModal();
        }
    }

    showVictoryModal() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';

        const modal = document.createElement('div');
        modal.className = 'game-over-modal victory-modal';
        modal.innerHTML = `
            <h2>Congratulations!</h2>
            <p>You guessed ${this.currentCharacter} correctly!</p>
            <button onclick="window.location.href='../index.html'">Return to Main Menu</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    handleWrongGuess() {
        this.lives--;
        this.updateLives();

        if (this.lives <= 0) {
            this.handleGameOver();
            return;
        }

        switch (this.difficulty) {
            case 'hard':
                this.shownKeywords++;
                this.showKeywords();
                break;
        }
    }

    saveGameCompletion() {
        const today = new Date().toISOString().split('T')[0];
        const gameData = {
            date: today,
            character: this.currentCharacter,
            difficulty: this.difficulty,
            livesLeft: this.lives
        };

        localStorage.setItem(`rivalsdle_character_${today}_${this.difficulty}`, JSON.stringify(gameData));
    }

    checkDailyAttempt() {
        const today = new Date().toISOString().split('T')[0];
        const attempt = localStorage.getItem(`rivalsdle_character_${today}_${this.difficulty}`);
        return attempt ? JSON.parse(attempt) : null;
    }

    updateLives() {
        const livesContainer = document.getElementById('lives-icons');
        livesContainer.innerHTML = '❤️'.repeat(this.lives) + '🖤'.repeat(this.getInitialLives() - this.lives);
        document.getElementById('lives-count').textContent = `Lives: ${this.lives}`;
    }

    handleGameOver() {
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
        }

        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
    
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        
        // Show different message for unlimited mode
        if (this.difficulty === 'unlimited') {
            modal.innerHTML = `
                <h2>Game Over!</h2>
                <p>You correctly guessed ${this.correctGuesses} characters!</p>
                <button onclick="window.location.href='../index.html'">Return to Main Menu</button>
            `;
        } else {
            modal.innerHTML = `
                <h2>You Failed!</h2>
                <button onclick="window.location.href='../index.html'">Return to Main Menu</button>
            `;
        }
    
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    showKeywords() {
        const img = document.getElementById('character-image');
        const keywordsContainer = document.getElementById('keywords-container');
        
        // Hide the image
        img.style.display = 'none';
        
        // Get all keyword arrays for current character
        const allKeywords = characterKeywords[this.currentCharacter].flat();
        
        // Shuffle keywords using the daily seed
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const seed = today.getTime() + this.difficulty.charCodeAt(0);
        
        // Fisher-Yates shuffle with seeded random
        for (let i = allKeywords.length - 1; i > 0; i--) {
            const j = Math.floor((this.seededRandom(seed + i, 1000) / 1000) * (i + 1));
            [allKeywords[i], allKeywords[j]] = [allKeywords[j], allKeywords[i]];
        }
        
        // Take first 5 keywords
        const selectedKeywords = allKeywords.slice(0, 5);
        
        // Clear and populate keywords container
        keywordsContainer.innerHTML = '';
        selectedKeywords.forEach(keyword => {
            const keywordElement = document.createElement('span');
            keywordElement.className = 'keyword';
            keywordElement.textContent = keyword;
            keywordsContainer.appendChild(keywordElement);
        });
    }

    async loadNextUnlimitedCharacter() {
        // Get a random character
        const randomIndex = Math.floor(Math.random() * charactersList.length);
        this.currentCharacter = charactersList[randomIndex];
        
        // Apply a random difficulty effect
        const difficulties = ['easy', 'medium', 'hard'];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        
        // Reset image and UI
        const img = document.getElementById('character-image');
        img.style.transform = 'none';
        img.style.filter = 'none';
        img.style.display = 'block';
        
        // Setup UI elements
        this.setupUI();
        
        // Load new image
        await this.loadCharacterImage();
        
        // Apply the random difficulty effect
        switch (randomDifficulty) {
            case 'easy':
                this.applySilhouette();
                break;
            case 'medium':
                this.applyZoom();
                break;
            case 'hard':
                this.showKeywords();
                break;
        }

        // Show YouTube chat for unlimited mode
        this.setupYouTubeChat();
    }

    setupYouTubeChat() {
        const chatContainer = document.getElementById('youtube-chat-container');
        chatContainer.style.display = 'block';

        // Clear any existing interval
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
        }

        // Get chat messages from the YouTube integration
        this.chatInterval = setInterval(() => {
            if (window.currentLiveChatMessages && window.currentLiveChatMessages.length > 0) {
                const chatMessages = document.getElementById('chat-messages');
                
                // Clear existing messages
                chatMessages.innerHTML = '';
                
                // Get only the last 15 messages
                const lastMessages = window.currentLiveChatMessages.slice(-15);
                
                // Add new messages
                lastMessages.forEach(message => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'chat-message';
                    messageDiv.innerHTML = `<strong style="color: ${this.getUserColor(message.author)}">${message.author}:</strong> ${message.message}`;
                    chatMessages.appendChild(messageDiv);
                });
                
                // Auto-scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 1000);
    }

    getUserColor(username) {
        if (!this.userColors.has(username)) {
            const colorIndex = this.userColors.size % this.availableColors.length;
            this.userColors.set(username, this.availableColors[colorIndex]);
        }
        return this.userColors.get(username);
    }
}

// Initialize game when document loads
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const difficulty = urlParams.get('difficulty') || 'easy';

    const game = new CharacterGame(difficulty);
});