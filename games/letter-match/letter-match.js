// Letter Match Game JavaScript

class LetterMatchGame {
    constructor() {
        this.stars = 0;
        this.score = 0;
        this.moves = 0;
        this.points = 0;
        this.gameStarted = false;
        this.gamePaused = false;
        this.timer = 0;
        this.timerInterval = null;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 14;
        
        this.letters = [
            'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص',
            'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'
        ];
        
        this.init();
    }

    init() {
        this.loadStars();
        this.setupEventListeners();
        this.updateStarsDisplay();
        this.showInstructions();
    }

    loadStars() {
        const savedStars = localStorage.getItem('letter_match_game_stars');
        this.stars = savedStars ? parseInt(savedStars) : 0;
    }

    saveStars() {
        localStorage.setItem('letter_match_game_stars', this.stars.toString());
    }

    addStars(amount) {
        this.stars += amount;
        this.saveStars();
        this.updateStarsDisplay();
        this.showStarAnimation();
    }

    updateStarsDisplay() {
        const starsContainer = document.querySelector('.stars');
        const starsCount = document.querySelector('.stars-count');
        
        if (starsContainer && starsCount) {
            starsContainer.innerHTML = '';
            for (let i = 0; i < 10; i++) {
                const star = document.createElement('span');
                star.className = `star ${i < this.stars ? 'active' : ''}`;
                star.textContent = '⭐';
                starsContainer.appendChild(star);
            }
            starsCount.textContent = this.stars;
        }
    }

    showStarAnimation() {
        const star = document.createElement('div');
        star.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: #FFD700;
            z-index: 1000;
            pointer-events: none;
            animation: starPop 1s ease-out forwards;
        `;
        star.textContent = '⭐';
        document.body.appendChild(star);

        setTimeout(() => {
            document.body.removeChild(star);
        }, 1000);
    }

    setupEventListeners() {
        // Control buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());

        // Modal buttons
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.hideInstructions();
            this.startGame();
        });
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideGameOver();
            this.resetGame();
            this.startGame();
        });
        document.getElementById('backToGamesBtn').addEventListener('click', () => {
            window.location.href = '../../games.html';
        });

        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-btn')) {
                const href = e.target.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            }
        });
    }

    showInstructions() {
        const modal = document.getElementById('instructionsModal');
        modal.classList.add('show');
    }

    hideInstructions() {
        const modal = document.getElementById('instructionsModal');
        modal.classList.remove('show');
    }

    showGameOver() {
        const modal = document.getElementById('gameOverModal');
        const percentage = Math.round((this.matchedPairs / this.totalPairs) * 100);
        
        document.getElementById('finalScore').textContent = `${this.matchedPairs}/${this.totalPairs}`;
        document.getElementById('finalTime').textContent = this.formatTime(this.timer);
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalPoints').textContent = this.points;
        
        const performanceMessage = document.getElementById('performanceMessage');
        if (percentage >= 90) {
            performanceMessage.textContent = '🎉 ممتاز! أنت خبير في مطابقة الحروف!';
            performanceMessage.style.background = 'rgba(46, 213, 115, 0.2)';
        } else if (percentage >= 70) {
            performanceMessage.textContent = '👍 جيد جداً! مهاراتك في التعرف على الحروف ممتازة!';
            performanceMessage.style.background = 'rgba(255, 165, 2, 0.2)';
        } else if (percentage >= 50) {
            performanceMessage.textContent = '👌 جيد! استمر في التعلم!';
            performanceMessage.style.background = 'rgba(255, 99, 72, 0.2)';
        } else {
            performanceMessage.textContent = '📚 واصل التعلم! ستتحسن مع الممارسة!';
            performanceMessage.style.background = 'rgba(255, 71, 87, 0.2)';
        }
        
        modal.classList.add('show');
    }

    hideGameOver() {
        const modal = document.getElementById('gameOverModal');
        modal.classList.remove('show');
    }

    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.gamePaused = false;
        this.score = 0;
        this.moves = 0;
        this.points = 0;
        this.timer = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        
        this.createBoard();
        this.startTimer();
        this.updateDisplay();
        this.updateButtons();
        this.showGame();
    }

    resetGame() {
        this.gameStarted = false;
        this.gamePaused = false;
        this.score = 0;
        this.moves = 0;
        this.points = 0;
        this.timer = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        
        this.stopTimer();
        this.updateDisplay();
        this.updateButtons();
        this.hideGame();
    }

    togglePause() {
        if (!this.gameStarted) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.stopTimer();
            document.getElementById('pauseBtn').textContent = '▶️ استئناف';
        } else {
            this.startTimer();
            document.getElementById('pauseBtn').textContent = '⏸️ إيقاف مؤقت';
        }
    }

    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        // Select 14 random letters for the game
        const selectedLetters = this.shuffleArray([...this.letters]).slice(0, this.totalPairs);
        const gameLetters = [...selectedLetters, ...selectedLetters]; // Duplicate for pairs
        const shuffledLetters = this.shuffleArray(gameLetters);
        
        shuffledLetters.forEach((letter, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-index', index);
            card.setAttribute('data-letter', letter);
            
            // Card front with icon
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.innerHTML = `<span class="fa-solid fa-circle-question" aria-label="بطاقة مغلقة" style="color:#ffd166;font-size:2.6rem;"></span>`;
            
            // Card back with styled letter
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.innerHTML = `<span class="letter-circle">${letter}</span>`;
            
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            card.addEventListener('click', () => this.flipCard(card));
            gameBoard.appendChild(card);
        });
    }

    flipCard(card) {
        if (this.gamePaused || !this.gameStarted) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (this.flippedCards.length >= 2) return;
        
        card.classList.add('flipped');
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.checkMatch();
        }
        
        this.updateDisplay();
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const letter1 = card1.getAttribute('data-letter');
        const letter2 = card2.getAttribute('data-letter');
        
        if (letter1 === letter2) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.matchedPairs++;
                this.points += 10;
                this.score = this.matchedPairs;
                
                this.showFeedback('🎉 مطابقة صحيحة!', 'correct');
                this.flippedCards = [];
                
                if (this.matchedPairs === this.totalPairs) {
                    this.endGame();
                }
                
                this.updateDisplay();
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.showFeedback('❌ مطابقة خاطئة، حاول مرة أخرى', 'incorrect');
                this.flippedCards = [];
            }, 1000);
        }
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = `feedback show ${type}`;
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 2000);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!this.gamePaused) {
                this.timer++;
                this.updateDisplay();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    endGame() {
        this.gameStarted = false;
        this.stopTimer();
        
        // Calculate bonus points
        const timeBonus = Math.max(0, 100 - this.timer);
        const movesBonus = Math.max(0, 50 - this.moves);
        this.points += timeBonus + movesBonus;
        
        // Add stars based on performance
        let starsEarned = 1;
        if (this.matchedPairs >= 12) starsEarned++;
        if (this.matchedPairs >= 14) starsEarned++;
        if (this.points >= 150) starsEarned++;
        
        this.addStars(starsEarned);
        this.updateDisplay();
        this.hideGame();
        this.showGameOver();
    }

    showGame() {
        document.getElementById('gameArea').classList.remove('hidden');
    }

    hideGame() {
        document.getElementById('gameArea').classList.add('hidden');
    }

    updateDisplay() {
        document.querySelector('.score').textContent = this.score;
        document.querySelector('.timer').textContent = this.formatTime(this.timer);
        document.querySelector('.moves').textContent = this.moves;
        document.querySelector('.points').textContent = this.points;
        
        // Update progress
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progress = (this.matchedPairs / this.totalPairs) * 100;
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${this.matchedPairs}/${this.totalPairs}`;
    }

    updateButtons() {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        startBtn.disabled = this.gameStarted;
        resetBtn.disabled = false;
        pauseBtn.disabled = !this.gameStarted;
    }
}

// Initialize the letter match game
document.addEventListener('DOMContentLoaded', () => {
    new LetterMatchGame();
}); 