// Count Game JavaScript

class CountGame {
    constructor() {
        this.stars = 0;
        this.currentLevel = 1;
        this.score = 0;
        this.points = 0;
        this.totalLevels = 10; // Numbers 1-10
        this.gameStarted = false;
        this.gamePaused = false;
        this.currentQuestion = 0;
        
        this.numbers = [
            { number: 1, name: 'واحد' },
            { number: 2, name: 'اثنان' },
            { number: 3, name: 'ثلاثة' },
            { number: 4, name: 'أربعة' },
            { number: 5, name: 'خمسة' },
            { number: 6, name: 'ستة' },
            { number: 7, name: 'سبعة' },
            { number: 8, name: 'ثمانية' },
            { number: 9, name: 'تسعة' },
            { number: 10, name: 'عشرة' }
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
        const savedStars = localStorage.getItem('count_game_stars');
        this.stars = savedStars ? parseInt(savedStars) : 0;
    }

    saveStars() {
        localStorage.setItem('count_game_stars', this.stars.toString());
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
            for (let i = 0; i < 5; i++) {
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
        const percentage = Math.round((this.score / this.totalLevels) * 100);
        
        document.getElementById('finalScore').textContent = `${this.score}/${this.totalLevels}`;
        document.getElementById('finalNumbers').textContent = this.score;
        document.getElementById('finalPoints').textContent = this.points;
        
        const performanceMessage = document.getElementById('performanceMessage');
        if (percentage >= 90) {
            performanceMessage.textContent = '🎉 ممتاز! أنت خبير في العد والأرقام!';
            performanceMessage.style.background = 'rgba(46, 213, 115, 0.2)';
        } else if (percentage >= 70) {
            performanceMessage.textContent = '👍 جيد جداً! معرفتك بالأرقام ممتازة!';
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
        this.currentLevel = 1;
        this.score = 0;
        this.points = 0;
        this.currentQuestion = 0;
        this.updateDisplay();
        this.updateButtons();
        this.showQuestion();
    }

    resetGame() {
        this.gameStarted = false;
        this.gamePaused = false;
        this.currentLevel = 1;
        this.score = 0;
        this.points = 0;
        this.currentQuestion = 0;
        this.updateDisplay();
        this.updateButtons();
        this.hideGame();
    }

    togglePause() {
        if (!this.gameStarted) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            document.getElementById('pauseBtn').textContent = '▶️ استئناف';
        } else {
            document.getElementById('pauseBtn').textContent = '⏸️ إيقاف مؤقت';
        }
    }

    showQuestion() {
        if (this.currentQuestion >= this.totalLevels) {
            this.endGame();
            return;
        }

        const targetNumber = this.numbers[this.currentQuestion];
        const options = this.generateNumberOptions(targetNumber);
        
        // Update number display
        const currentNumberElement = document.getElementById('currentNumber');
        const numberNameElement = document.getElementById('numberName');
        
        currentNumberElement.textContent = targetNumber.number;
        numberNameElement.textContent = targetNumber.name;
        
        // Add animation to number card
        const numberCard = document.getElementById('numberCard');
        numberCard.style.animation = 'numberBounce 0.5s ease-in-out';
        setTimeout(() => {
            numberCard.style.animation = '';
        }, 500);
        
        // Generate number options
        const numberOptionsContainer = document.getElementById('numberOptions');
        numberOptionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const numberOption = document.createElement('div');
            numberOption.className = 'number-option';
            numberOption.textContent = option.name;
            numberOption.setAttribute('data-index', index);
            numberOption.setAttribute('data-name', option.name);
            numberOption.addEventListener('click', (e) => this.selectNumber(e));
            numberOptionsContainer.appendChild(numberOption);
        });

        // Update progress
        this.updateProgress();
        
        // Update balls to count
        const ballsContainer = document.getElementById('ballsContainer');
        if (ballsContainer) {
            ballsContainer.innerHTML = '';
            for (let i = 0; i < targetNumber.number; i++) {
                const ball = document.createElement('div');
                ball.className = 'count-ball';
                ballsContainer.appendChild(ball);
            }
        }
        
        // Show game area
        document.getElementById('gameArea').classList.remove('hidden');
    }

    generateNumberOptions(targetNumber) {
        const options = [targetNumber];
        const availableNumbers = this.numbers.filter(number => number.name !== targetNumber.name);
        
        // Add 3 random wrong options
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            options.push(availableNumbers[randomIndex]);
            availableNumbers.splice(randomIndex, 1);
        }
        
        // Shuffle options
        return this.shuffleArray(options);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    selectNumber(event) {
        if (this.gamePaused) return;
        
        const selectedName = event.target.getAttribute('data-name');
        const targetName = document.getElementById('numberName').textContent;
        const isCorrect = selectedName === targetName;
        
        // Disable all options
        const numberOptions = document.querySelectorAll('.number-option');
        numberOptions.forEach(option => {
            option.style.pointerEvents = 'none';
        });

        // Show feedback
        const feedback = document.getElementById('feedback');
        if (isCorrect) {
            event.target.classList.add('correct');
            feedback.textContent = '🎉 إجابة صحيحة! أحسنت!';
            feedback.className = 'feedback show correct';
            this.score++;
            this.points += 10;
        } else {
            event.target.classList.add('incorrect');
            // Show correct answer
            numberOptions.forEach(option => {
                if (option.getAttribute('data-name') === targetName) {
                    option.classList.add('correct');
                }
            });
            feedback.textContent = `❌ إجابة خاطئة. الاسم الصحيح هو: ${targetName}`;
            feedback.className = 'feedback show incorrect';
        }

        this.currentQuestion++;
        this.updateDisplay();

        // Move to next question after delay
        setTimeout(() => {
            this.showQuestion();
        }, 2000);
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progress = (this.currentQuestion / this.totalLevels) * 100;
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${this.currentQuestion}/${this.totalLevels}`;
    }

    endGame() {
        this.gameStarted = false;
        
        // Calculate bonus points
        const accuracyBonus = Math.round((this.score / this.totalLevels) * 50);
        this.points += accuracyBonus;
        
        // Add stars based on performance
        let starsEarned = 1;
        if (this.score >= 8) starsEarned++;
        if (this.score >= 9) starsEarned++;
        if (this.points >= 100) starsEarned++;
        
        this.addStars(starsEarned);
        this.updateDisplay();
        this.hideGame();
        this.showGameOver();
    }

    hideGame() {
        document.getElementById('gameArea').classList.add('hidden');
    }

    updateDisplay() {
        document.querySelector('.score').textContent = this.score;
        document.querySelector('.current-number').textContent = this.numbers[this.currentQuestion]?.number || 1;
        document.querySelector('.points').textContent = this.points;
    }

    updateButtons() {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        startBtn.disabled = this.gameStarted;
        resetBtn.disabled = false;
        pauseBtn.disabled = !this.gameStarted;
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

// Initialize the count game
document.addEventListener('DOMContentLoaded', () => {
    new CountGame();
}); 