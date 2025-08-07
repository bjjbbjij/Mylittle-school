// Color Box Game JavaScript

class ColorBoxGame {
    constructor() {
        this.stars = 0;
        this.score = 0;
        this.level = 1;
        this.points = 0;
        this.gameStarted = false;
        this.gamePaused = false;
        this.timer = 0;
        this.timerInterval = null;
        this.currentLevel = 0;
        this.totalLevels = 10;
        
        this.colors = [
            { name: 'أحمر', hex: '#FF4757', arabic: 'أحمر' },
            { name: 'أزرق', hex: '#3742FA', arabic: 'أزرق' },
            { name: 'أخضر', hex: '#2ED573', arabic: 'أخضر' },
            { name: 'أصفر', hex: '#FFA502', arabic: 'أصفر' },
            { name: 'برتقالي', hex: '#FF6348', arabic: 'برتقالي' },
            { name: 'بنفسجي', hex: '#5F27CD', arabic: 'بنفسجي' },
            { name: 'وردي', hex: '#FF6B9D', arabic: 'وردي' },
            { name: 'بني', hex: '#A0522D', arabic: 'بني' },
            { name: 'رمادي', hex: '#747D8C', arabic: 'رمادي' },
            { name: 'أسود', hex: '#2F3542', arabic: 'أسود' },
            { name: 'أبيض', hex: '#FFFFFF', arabic: 'أبيض' },
            { name: 'فيروزي', hex: '#00D2D3', arabic: 'فيروزي' }
        ];
        
        this.sounds = {
            click: new Audio('sounds/ui/pop.mp3'),
            correct: new Audio('sounds/ui/correct.mp3'),
            incorrect: new Audio('sounds/ui/wrong.mp3')
        };
        
        this.init();
    }

    init() {
        this.loadStars();
        this.setupEventListeners();
        this.updateStarsDisplay();
        this.showInstructions();
    }

    loadStars() {
        const savedStars = localStorage.getItem('color_box_game_stars');
        this.stars = savedStars ? parseInt(savedStars) : 0;
    }

    saveStars() {
        localStorage.setItem('color_box_game_stars', this.stars.toString());
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
        const percentage = Math.round((this.score / this.totalLevels) * 100);
        
        document.getElementById('finalScore').textContent = `${this.score}/${this.totalLevels}`;
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('finalTime').textContent = this.formatTime(this.timer);
        document.getElementById('finalPoints').textContent = this.points;
        
        const performanceMessage = document.getElementById('performanceMessage');
        if (percentage >= 90) {
            performanceMessage.textContent = '🎉 ممتاز! أنت خبير في التعرف على الألوان!';
            performanceMessage.style.background = 'rgba(46, 213, 115, 0.2)';
        } else if (percentage >= 70) {
            performanceMessage.textContent = '👍 جيد جداً! مهاراتك في التعرف على الألوان ممتازة!';
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
        this.level = 1;
        this.points = 0;
        this.timer = 0;
        this.currentLevel = 0;
        
        this.startTimer();
        this.nextLevel();
        this.updateDisplay();
        this.updateButtons();
        this.showGame();
    }

    resetGame() {
        this.gameStarted = false;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.points = 0;
        this.timer = 0;
        this.currentLevel = 0;
        
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

    nextLevel() {
        if (this.currentLevel >= this.totalLevels) {
            this.endGame();
            return;
        }

        this.currentLevel++;
        this.level = this.currentLevel;
        
        // Select target color
        const targetColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        // Update target display
        const targetNameElement = document.getElementById('targetName');
        targetNameElement.textContent = targetColor.arabic;
        
        // Create color grid
        this.createColorGrid(targetColor);
        
        // Update progress
        this.updateProgress();
    }

    createColorGrid(targetColor) {
        const colorGrid = document.getElementById('colorGrid');
        colorGrid.innerHTML = '';
        
        // Create array of colors including target and random colors
        const gridColors = [targetColor];
        
        // Add random colors (excluding target)
        const availableColors = this.colors.filter(color => color.name !== targetColor.name);
        for (let i = 0; i < 15; i++) {
            const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
            gridColors.push(randomColor);
        }
        
        // Shuffle colors
        const shuffledColors = this.shuffleArray(gridColors);
        
        // Create color boxes (بدون نص)
        shuffledColors.forEach((color, index) => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color.hex;
            colorBox.setAttribute('data-color', color.name);
            colorBox.setAttribute('data-index', index);
            // لا تضع أي نص داخل الصندوق
            colorBox.addEventListener('click', () => this.selectColor(colorBox, color, targetColor));
            colorGrid.appendChild(colorBox);
        });
    }

    selectColor(colorBox, selectedColor, targetColor) {
        if (this.gamePaused || !this.gameStarted) return;
        
        const isCorrect = selectedColor.name === targetColor.name;
        // حفظ اللون الأصلي
        const originalBg = colorBox.style.backgroundColor;
        colorBox.style.backgroundColor = 'transparent';
        // مؤثر بصري
        colorBox.style.transition = 'transform 0.18s';
        colorBox.style.transform = 'scale(1.13)';
        setTimeout(() => { colorBox.style.transform = 'scale(1)'; }, 180);
        // صوت عند الضغط
        this.sounds.click.currentTime = 0;
        this.sounds.click.play();
        
        if (isCorrect) {
            colorBox.classList.add('correct');
            this.score++;
            this.points += 10;
            this.showFeedback('🎉 إجابة صحيحة!', 'correct');
            // صوت صحيح
            this.sounds.correct.currentTime = 0;
            this.sounds.correct.play();
            // أرجع اللون بعد التأكيد وانتقل للمستوى التالي
            setTimeout(() => {
                colorBox.style.backgroundColor = originalBg;
                this.nextLevel();
            }, 1000);
        } else {
            colorBox.classList.add('incorrect');
            this.showFeedback('❌ إجابة خاطئة، حاول مرة أخرى', 'incorrect');
            // صوت خطأ
            this.sounds.incorrect.currentTime = 0;
            this.sounds.incorrect.play();
            // أرجع اللون بعد التأكيد
            setTimeout(() => {
                colorBox.classList.remove('incorrect');
                colorBox.style.backgroundColor = originalBg;
            }, 1000);
        }
        
        this.updateDisplay();
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

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progress = (this.currentLevel / this.totalLevels) * 100;
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${this.currentLevel}/${this.totalLevels}`;
    }

    endGame() {
        this.gameStarted = false;
        this.stopTimer();
        
        // Calculate bonus points
        const timeBonus = Math.max(0, 100 - this.timer);
        const accuracyBonus = Math.round((this.score / this.totalLevels) * 50);
        this.points += timeBonus + accuracyBonus;
        
        // Add stars based on performance
        let starsEarned = 1;
        if (this.score >= 8) starsEarned++;
        if (this.score >= 9) starsEarned++;
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
        document.querySelector('.level').textContent = this.level;
        document.querySelector('.timer').textContent = this.formatTime(this.timer);
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
}

// Initialize the color box game
document.addEventListener('DOMContentLoaded', () => {
    new ColorBoxGame();
}); 