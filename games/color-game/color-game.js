// منطق لعبة الألوان سيضاف هنا لاحقاً 

// Color Game JavaScript

class ColorGame {
    constructor() {
        this.stars = 0;
        this.currentLevel = 1;
        this.score = 0;
        this.points = 0;
        this.totalLevels = 10;
        this.gameStarted = false;
        this.gamePaused = false;
        this.currentQuestion = 0;
        
        this.colors = [
            { name: 'أحمر', hex: '#fc0303', arabic: 'أحمر' }, 
            { name: 'أزرق', hex: '#1703fc', arabic: 'أزرق' },
            { name: 'أخضر', hex: '#00fa1d', arabic: 'أخضر' }, 
            { name: 'أصفر', hex: '#fcf003', arabic: 'أصفر' },
            { name: 'برتقالي', hex: '#fc7703', arabic: 'برتقالي' },
            { name: 'بنفسجي', hex: '#b505fc', arabic: 'بنفسجي' },
            { name: 'وردي', hex: '#fc6da0', arabic: 'وردي' },
            { name: 'بني', hex: '#8a542d', arabic: 'بني' },
            { name: 'رمادي', hex: '#929494', arabic: 'رمادي' },
            { name: 'أسود', hex: '#000000', arabic: 'أسود' }
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
        const savedStars = localStorage.getItem('color_game_stars');
        this.stars = savedStars ? parseInt(savedStars) : 0;
    }

    saveStars() {
        localStorage.setItem('color_game_stars', this.stars.toString());
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
        document.getElementById('finalLevel').textContent = this.currentLevel;
        document.getElementById('finalPoints').textContent = this.points;
        
        const performanceMessage = document.getElementById('performanceMessage');
        if (percentage >= 90) {
            performanceMessage.textContent = '🎉 ممتاز! أنت خبير في الألوان!';
            performanceMessage.style.background = 'rgba(46, 213, 115, 0.2)';
        } else if (percentage >= 70) {
            performanceMessage.textContent = '👍 جيد جداً! معرفتك بالألوان ممتازة!';
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

        const targetColor = this.getRandomColor();
        const options = this.generateColorOptions(targetColor);
        
        // Update target color display
        const targetColorElement = document.getElementById('targetColor');
        const targetNameElement = document.getElementById('targetName');
        
        targetColorElement.style.backgroundColor = targetColor.hex;
        targetNameElement.textContent = targetColor.arabic;
        
        // Generate color options
        const colorOptionsContainer = document.getElementById('colorOptions');
        colorOptionsContainer.innerHTML = '';
        
        options.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = 'color-option';
            colorOption.style.backgroundColor = color.hex;
            colorOption.setAttribute('data-index', index);
            colorOption.setAttribute('data-color', color.name);
            colorOption.addEventListener('click', (e) => this.selectColor(e));
            colorOptionsContainer.appendChild(colorOption);
        });

        // Update progress
        this.updateProgress();
        
        // Show game area
        document.getElementById('gameArea').classList.remove('hidden');
    }

    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    generateColorOptions(targetColor) {
        const options = [targetColor];
        const availableColors = this.colors.filter(color => color.name !== targetColor.name);
        
        // Add 3 random wrong options
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * availableColors.length);
            options.push(availableColors[randomIndex]);
            availableColors.splice(randomIndex, 1);
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

    selectColor(event) {
        if (this.gamePaused) return;
        
        const selectedColor = event.target.getAttribute('data-color');
        const targetColor = document.getElementById('targetName').textContent;
        const isCorrect = this.isColorMatch(selectedColor, targetColor);
        
        // Disable all options
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
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
            colorOptions.forEach(option => {
                if (this.isColorMatch(option.getAttribute('data-color'), targetColor)) {
                    option.classList.add('correct');
                }
            });
            feedback.textContent = `❌ إجابة خاطئة. اللون الصحيح هو: ${targetColor}`;
            feedback.className = 'feedback show incorrect';
        }

        this.currentQuestion++;
        this.updateDisplay();

        // Move to next question after delay
        setTimeout(() => {
            this.showQuestion();
        }, 2000);
    }

    isColorMatch(colorName, targetName) {
        const colorMap = {
            'أحمر': 'أحمر',
            'أزرق': 'أزرق',
            'أخضر': 'أخضر',
            'أصفر': 'أصفر',
            'برتقالي': 'برتقالي',
            'بنفسجي': 'بنفسجي',
            'وردي': 'وردي',
            'بني': 'بني',
            'رمادي': 'رمادي',
            'أسود': 'أسود'
        };
        
        return colorMap[colorName] === targetName;
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
        document.querySelector('.level').textContent = this.currentLevel;
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

// Initialize the color game
document.addEventListener('DOMContentLoaded', () => {
    new ColorGame();
}); 