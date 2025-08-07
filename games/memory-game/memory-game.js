// Memory Game JavaScript

class MemoryGame {
    constructor() {
        this.stars = 0;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 8;
        this.score = 0;
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        this.gamePaused = false;
        
        this.cardSymbols = [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
            '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'
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
        const savedStars = localStorage.getItem('memory_game_stars');
        this.stars = savedStars ? parseInt(savedStars) : 0;
    }

    saveStars() {
        localStorage.setItem('memory_game_stars', this.stars.toString());
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

        // تأثير بصري عند اللمس على روابط التنقل فقط
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            btn.addEventListener('touchend', function() {
                this.style.transform = '';
            });
            // عند الضغط على أي زر تنقل، أغلق أي modal ظاهر
            btn.addEventListener('click', function() {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('show');
                });
            });
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
        document.getElementById('finalTime').textContent = this.formatTime(this.timer);
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalScore').textContent = this.score;
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
        this.createCards();
        this.startTimer();
        this.updateButtons();
    }

    resetGame() {
        this.stopTimer();
        this.gameStarted = false;
        this.gamePaused = false;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.moves = 0;
        this.timer = 0;
        this.updateDisplay();
        this.updateButtons();
        this.clearBoard();
    }

    togglePause() {
        if (!this.gameStarted) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.stopTimer();
            document.getElementById('pauseBtn').innerHTML = '<i class="fa-solid fa-play" style="color: #74C0FC;"></i> استئناف';
        } else {
            this.startTimer();
            document.getElementById('pauseBtn').innerHTML = '<i class="fa-solid fa-pause" style="color: #74C0FC;"></i> إيقاف مؤقت';
        }
    }

    createCards() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        // Create pairs of cards
        const selectedSymbols = this.cardSymbols.slice(0, this.totalPairs);
        const cardPairs = [...selectedSymbols, ...selectedSymbols];
        
        // Shuffle cards
        this.shuffleArray(cardPairs);
        
        cardPairs.forEach((symbol, index) => {
            const card = this.createCard(symbol, index);
            gameBoard.appendChild(card);
            this.cards.push(card);
        });
    }

    createCard(symbol, index) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('data-index', index);
        card.setAttribute('data-symbol', symbol);
        
        card.innerHTML = `
            <div class="card-front"><span class="fa-solid fa-circle-question" aria-label="بطاقة مغلقة" style="color:#ffd166;font-size:2.4rem;"></span></div>
            <div class="card-back"><span class="emoji-circle">${symbol}</span></div>
        `;
        
        card.addEventListener('click', () => this.flipCard(card));
        
        return card;
    }

    flipCard(card) {
        if (!this.gameStarted || this.gamePaused) return;
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (this.flippedCards.length >= 2) return;

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const symbol1 = card1.getAttribute('data-symbol');
        const symbol2 = card2.getAttribute('data-symbol');

        if (symbol1 === symbol2) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.matchedPairs++;
                this.score += 10;
                this.updateDisplay();
                this.flippedCards = [];
                
                if (this.matchedPairs === this.totalPairs) {
                    this.gameWon();
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
            }, 1000);
        }
    }

    gameWon() {
        this.stopTimer();
        this.gameStarted = false;
        
        // Calculate bonus points
        const timeBonus = Math.max(0, 100 - this.timer);
        const movesBonus = Math.max(0, 50 - this.moves);
        const totalBonus = timeBonus + movesBonus;
        this.score += totalBonus;
        
        // Add stars based on performance
        let starsEarned = 1;
        if (this.timer < 60) starsEarned++;
        if (this.moves < 20) starsEarned++;
        if (this.score > 150) starsEarned++;
        
        this.addStars(starsEarned);
        this.updateDisplay();
        this.showGameOver();
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

    updateDisplay() {
        document.querySelector('.score').textContent = this.score;
        document.querySelector('.timer').textContent = this.formatTime(this.timer);
        document.querySelector('.moves').textContent = this.moves;
    }

    updateButtons() {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        startBtn.disabled = this.gameStarted;
        resetBtn.disabled = false;
        pauseBtn.disabled = !this.gameStarted;
    }

    clearBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1001;
            font-family: inherit;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes starPop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the memory game
document.addEventListener('DOMContentLoaded', () => {
    const game = new MemoryGame();
    game.startGame(); // ابدأ اللعبة تلقائيًا
}); 