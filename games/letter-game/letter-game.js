// منطق لعبة الحروف سيضاف هنا لاحقاً 

// Letter Game JavaScript

class LetterGame {
    constructor() {
        this.stars = 0;
        this.currentLevel = 1;
        this.score = 0;
        this.points = 0;
        this.totalLevels = 28; // All Arabic letters
        this.gameStarted = false;
        this.gamePaused = false;
        this.currentQuestion = 0;
        
        this.letters = [
            { letter: 'أ', name: 'ألف' },
            { letter: 'ب', name: 'باء' },
            { letter: 'ت', name: 'تاء' },
            { letter: 'ث', name: 'ثاء' },
            { letter: 'ج', name: 'جيم' },
            { letter: 'ح', name: 'حاء' },
            { letter: 'خ', name: 'خاء' },
            { letter: 'د', name: 'دال' },
            { letter: 'ذ', name: 'ذال' },
            { letter: 'ر', name: 'راء' },
            { letter: 'ز', name: 'زاي' },
            { letter: 'س', name: 'سين' },
            { letter: 'ش', name: 'شين' },
            { letter: 'ص', name: 'صاد' },
            { letter: 'ض', name: 'ضاد' },
            { letter: 'ط', name: 'طاء' },
            { letter: 'ظ', name: 'ظاء' },
            { letter: 'ع', name: 'عين' },
            { letter: 'غ', name: 'غين' },
            { letter: 'ف', name: 'فاء' },
            { letter: 'ق', name: 'قاف' },
            { letter: 'ك', name: 'كاف' },
            { letter: 'ل', name: 'لام' },
            { letter: 'م', name: 'ميم' },
            { letter: 'ن', name: 'نون' },
            { letter: 'ه', name: 'هاء' },
            { letter: 'و', name: 'واو' },
            { letter: 'ي', name: 'ياء' }
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
        const savedStars = localStorage.getItem('letter_game_stars');
        this.stars = savedStars ? parseInt(savedStars) : 0;
    }

    saveStars() {
        localStorage.setItem('letter_game_stars', this.stars.toString());
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
        document.getElementById('finalLetters').textContent = this.score;
        document.getElementById('finalPoints').textContent = this.points;
        
        const performanceMessage = document.getElementById('performanceMessage');
        if (percentage >= 90) {
            performanceMessage.textContent = '🎉 ممتاز! أنت خبير في الحروف العربية!';
            performanceMessage.style.background = 'rgba(46, 213, 115, 0.2)';
        } else if (percentage >= 70) {
            performanceMessage.textContent = '👍 جيد جداً! معرفتك بالحروف ممتازة!';
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

        const targetLetter = this.letters[this.currentQuestion];
        const options = this.generateLetterOptions(targetLetter);
        // Update letter display
        const currentLetterElement = document.getElementById('currentLetter');
        // إظهار رمز الحرف فقط
        currentLetterElement.textContent = targetLetter.letter;
        // إظهار اسم الحرف فوق البطاقة
        let nameDisplay = document.getElementById('letterNameDisplay');
        if (!nameDisplay) {
            nameDisplay = document.createElement('div');
            nameDisplay.id = 'letterNameDisplay';
            nameDisplay.style = 'font-size:1.2rem;color:#ffd166;font-weight:700;margin-bottom:8px;text-align:center;';
            currentLetterElement.parentNode.insertBefore(nameDisplay, currentLetterElement);
        }
        nameDisplay.textContent = `اسم الحرف: ${targetLetter.name}`;
        // Add animation to letter card
        const letterCard = document.getElementById('letterCard');
        letterCard.style.animation = 'letterBounce 0.5s ease-in-out';
        setTimeout(() => {
            letterCard.style.animation = '';
        }, 500);
        // Generate letter options
        const letterOptionsContainer = document.getElementById('letterOptions');
        letterOptionsContainer.innerHTML = '';
        options.forEach((option, index) => {
            const letterOption = document.createElement('div');
            letterOption.className = 'letter-option';
            // فقط اسم الحرف (بدون رمز)
            letterOption.textContent = option.name;
            letterOption.setAttribute('data-index', index);
            letterOption.setAttribute('data-name', option.name);
            letterOption.addEventListener('click', (e) => this.selectLetter(e));
            letterOptionsContainer.appendChild(letterOption);
        });
        // Update progress
        this.updateProgress();
        // Show game area
        document.getElementById('gameArea').classList.remove('hidden');
    }

    generateLetterOptions(targetLetter) {
        const options = [targetLetter];
        const availableLetters = this.letters.filter(letter => letter.name !== targetLetter.name);
        
        // Add 3 random wrong options
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * availableLetters.length);
            options.push(availableLetters[randomIndex]);
            availableLetters.splice(randomIndex, 1);
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

    selectLetter(event) {
        if (this.gamePaused) return;
        const selectedName = event.target.getAttribute('data-name');
        // احصل على اسم الحرف من العنصر الصحيح في السؤال
        const nameDisplay = document.getElementById('letterNameDisplay');
        const targetName = nameDisplay ? nameDisplay.textContent.replace('اسم الحرف: ', '') : '';
        const isCorrect = selectedName === targetName;
        // تعطيل جميع الخيارات
        const letterOptions = document.querySelectorAll('.letter-option');
        letterOptions.forEach(option => { option.style.pointerEvents = 'none'; });
        // إظهار التغذية الراجعة
        const feedback = document.getElementById('feedback');
        if (isCorrect) {
            event.target.classList.add('correct');
            feedback.textContent = '🎉 إجابة صحيحة! أحسنت!';
            feedback.className = 'feedback show correct';
            this.score++;
            this.points += 10;
        } else {
            event.target.classList.add('incorrect');
            // إظهار الإجابة الصحيحة
            letterOptions.forEach(option => {
                if (option.getAttribute('data-name') === targetName) {
                    option.classList.add('correct');
                }
            });
            feedback.textContent = `❌ إجابة خاطئة. الاسم الصحيح هو: ${targetName}`;
            feedback.className = 'feedback show incorrect';
        }
        this.currentQuestion++;
        this.updateDisplay();
        // الانتقال للسؤال التالي بعد مهلة
        setTimeout(() => { this.showQuestion(); }, 2000);
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
        if (this.score >= 20) starsEarned++;
        if (this.score >= 25) starsEarned++;
        if (this.points >= 250) starsEarned++;
        
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
        document.querySelector('.current-letter').textContent = this.letters[this.currentQuestion]?.letter || 'أ';
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

// Initialize the letter game
document.addEventListener('DOMContentLoaded', () => {
    new LetterGame();
}); 