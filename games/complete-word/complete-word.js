// منطق لعبة اكمل الكلمة سيضاف هنا لاحقاً 

// Complete Word Game JavaScript

class CompleteWordGame {
    constructor() {
        this.stars = 0;
        this.currentLevel = 1;
        this.score = 0;
        this.points = 0;
        this.totalLevels = 10;
        this.gameStarted = false;
        this.gamePaused = false;
        this.currentQuestion = 0;
        
this.allWords = [
    { word: 'قط', prompt: 'ق_ط', hint: 'حيوان أليف', missingLetter: 'ط' },
    { word: 'كلب', prompt: 'ك_ب', hint: 'حيوان مخلص', missingLetter: 'ل' },
    { word: 'باب', prompt: 'ب_ب', hint: 'يدخل منه الإنسان', missingLetter: 'ا' },
    { word: 'قلم', prompt: 'ق_م', hint: 'يكتب به', missingLetter: 'ل' },
    { word: 'كتاب', prompt: 'كت_ب', hint: 'يقرأ منه', missingLetter: 'ا' },
    { word: 'مدرسة', prompt: 'مدر_ة', hint: 'مكان التعلم', missingLetter: 'س' },
    { word: 'سيارة', prompt: 'سيا_ة', hint: 'وسيلة نقل', missingLetter: 'ر' },
    { word: 'شجرة', prompt: 'شج_ة', hint: 'نبات كبير', missingLetter: 'ر' },
    { word: 'بيت', prompt: 'ب_ت', hint: 'مكان السكن', missingLetter: 'ي' },
    { word: 'ماء', prompt: 'م_ء', hint: 'شراب الحياة', missingLetter: 'ا' },
    // كلمات جديدة
    { word: 'نجمة', prompt: 'نج_ة', hint: 'تلمع في السماء', missingLetter: 'م' },
    { word: 'قميص', prompt: 'قم_ص', hint: 'ثوب علوي', missingLetter: 'ي' },
    { word: 'تفاح', prompt: 'تف_ح', hint: 'فاكهة حمراء أو خضراء', missingLetter: 'ا' },
    { word: 'كرسي', prompt: 'كر_ي', hint: 'للجلوس عليه', missingLetter: 'س' },
    { word: 'مصباح', prompt: 'مص_اح', hint: 'ينير الغرفة', missingLetter: 'ب' },
    { word: 'هاتف', prompt: 'ها_ف', hint: 'للتواصل عن بعد', missingLetter: 'ت' },
    { word: 'قمر', prompt: 'ق_ر', hint: 'نراه ليلاً في السماء', missingLetter: 'م' },
    { word: 'مفتاح', prompt: 'مف_اح', hint: 'يفتح الباب', missingLetter: 'ت' },
    { word: 'نافذة', prompt: 'ناف_ة', hint: 'تُطل منها', missingLetter: 'ذ' },
    { word: 'كمبيوتر', prompt: 'كمب_وتر', hint: 'جهاز إلكتروني', missingLetter: 'ي' }
];

        this.words = this.shuffleArray(this.allWords).slice(0, this.totalLevels);

        this.init();
    }

    init() {
        this.loadStars();
        this.setupEventListeners();
        this.updateStarsDisplay();
        this.showInstructions();
    }

    loadStars() {
        const savedStars = localStorage.getItem('complete_word_game_stars');
        this.stars = savedStars ? parseInt(savedStars) : 0;
    }

    saveStars() {
        localStorage.setItem('complete_word_game_stars', this.stars.toString());
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
        document.getElementById('finalWords').textContent = this.score;
        document.getElementById('finalPoints').textContent = this.points;
        
        const performanceMessage = document.getElementById('performanceMessage');
        if (percentage >= 90) {
            performanceMessage.textContent = '🎉 ممتاز! أنت خبير في إكمال الكلمات!';
            performanceMessage.style.background = 'rgba(46, 213, 115, 0.2)';
        } else if (percentage >= 70) {
            performanceMessage.textContent = '👍 جيد جداً! مهاراتك في اللغة ممتازة!';
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

        const targetWord = this.words[this.currentQuestion];
        const options = this.generateLetterOptions(targetWord);
        
        // Update word display
        const wordPromptElement = document.getElementById('wordPrompt');
        const wordHintElement = document.getElementById('wordHint');
        
        wordPromptElement.textContent = `أكمل الكلمة: ${targetWord.prompt}`;
        wordHintElement.textContent = targetWord.hint;
        
        // Add animation to word card
        const wordCard = document.getElementById('wordCard');
        wordCard.style.animation = 'wordBounce 0.5s ease-in-out';
        setTimeout(() => {
            wordCard.style.animation = '';
        }, 500);
        
        // Generate letter options
        const letterOptionsContainer = document.getElementById('letterOptions');
        letterOptionsContainer.innerHTML = '';
        
        options.forEach((letter, index) => {
            const letterOption = document.createElement('div');
            letterOption.className = 'letter-option';
            letterOption.textContent = letter;
            letterOption.setAttribute('data-index', index);
            letterOption.setAttribute('data-letter', letter);
            letterOption.addEventListener('click', (e) => this.selectLetter(e));
            letterOptionsContainer.appendChild(letterOption);
        });

        // Update progress
        this.updateProgress();
        
        // Show game area
        document.getElementById('gameArea').classList.remove('hidden');
    }

    generateLetterOptions(targetWord) {
        const correctLetter = targetWord.missingLetter;
        const options = [correctLetter];
        
        // Add 3 random wrong letters
        const arabicLetters = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
        const availableLetters = arabicLetters.filter(letter => letter !== correctLetter);
        
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
        
        const selectedLetter = event.target.getAttribute('data-letter');
        const targetWord = this.words[this.currentQuestion];
        const isCorrect = selectedLetter === targetWord.missingLetter;
        
        // Disable all options
        const letterOptions = document.querySelectorAll('.letter-option');
        letterOptions.forEach(option => {
            option.style.pointerEvents = 'none';
        });

        // Show feedback
        const feedback = document.getElementById('feedback');
        if (isCorrect) {
            event.target.classList.add('correct');
            feedback.textContent = `🎉 إجابة صحيحة! الكلمة هي: ${targetWord.word}`;
            feedback.className = 'feedback show correct';
            this.score++;
            this.points += 10;
        } else {
            event.target.classList.add('incorrect');
            // Show correct answer
            letterOptions.forEach(option => {
                if (option.getAttribute('data-letter') === targetWord.missingLetter) {
                    option.classList.add('correct');
                }
            });
            feedback.textContent = `❌ إجابة خاطئة. الحرف الصحيح هو: ${targetWord.missingLetter} - الكلمة: ${targetWord.word}`;
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
        document.querySelector('.current-word').textContent = this.currentQuestion + 1;
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

// Initialize the complete word game
document.addEventListener('DOMContentLoaded', () => {
    new CompleteWordGame();
}); 