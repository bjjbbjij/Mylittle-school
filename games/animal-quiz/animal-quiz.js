// منطق لعبة التعرف على الحيوان سيضاف هنا لاحقاً 

// Animal Quiz Game JavaScript

class AnimalQuiz {
    constructor() {
        this.stars = 0;
        this.currentQuestion = 0;
        this.score = 0;
        this.points = 0;
        this.totalQuestions = 10;
        this.gameStarted = false;
        this.gamePaused = false;
        this.questionsAnswered = 0;
        
        this.questions = [
            {
                question: "ما هو الحيوان الذي يسمى ملك الغابة؟",
                image: "🦁",
                options: ["أسد", "فيل", "زرافة", "قرد"],
                correct: 0
            },
            {
                question: "أي حيوان له عنق طويل جداً؟",
                image: "🦒",
                options: ["حصان", "زرافة", "فيل", "بقرة"],
                correct: 1
            },
            {
                question: "ما هو الحيوان الذي يعطينا الحليب؟",
                image: "🐄",
                options: ["خروف", "بقرة", "دجاجة", "حصان"],
                correct: 1
            },
            {
                question: "أي حيوان يضع البيض؟",
                image: "🐔",
                options: ["دجاجة", "كلب", "قط", "خروف"],
                correct: 0
            },
            {
                question: "ما هو أفضل صديق للإنسان؟",
                image: "🐕",
                options: ["قط", "كلب", "حصان", "بقرة"],
                correct: 1
            },
            {
                question: "أي حيوان يحب النوم كثيراً؟",
                image: "🐈",
                options: ["قط", "كلب", "حصان", "دجاجة"],
                correct: 0
            },
            {
                question: "ما هو الحيوان الذي له خرطوم طويل؟",
                image: "🐘",
                options: ["فيل", "زرافة", "حصان", "بقرة"],
                correct: 0
            },
            {
                question: "أي حيوان يحب اللعب والتسلق؟",
                image: "🐒",
                options: ["قرد", "كلب", "قط", "حصان"],
                correct: 0
            },
            {
                question: "ما هو الحيوان الذي يركض بسرعة؟",
                image: "🐎",
                options: ["حصان", "بقرة", "خروف", "دجاجة"],
                correct: 0
            },
            {
                question: "أي حيوان له صوف ناعم؟",
                image: "🐑",
                options: ["خروف", "بقرة", "حصان", "كلب"],
                correct: 0
            }
        ];
        
        this.init();
    }

    init() {
        this.loadStars();
        this.setupEventListeners();
        this.updateStarsDisplay();
        this.showInstructions();
        this.shuffleQuestions();
    }

    loadStars() {
        const savedStars = localStorage.getItem('animal_quiz_stars');
        this.stars = savedStars ? parseInt(savedStars) : 0;
    }

    saveStars() {
        localStorage.setItem('animal_quiz_stars', this.stars.toString());
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
        document.getElementById('startBtn').addEventListener('click', () => this.startQuiz());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetQuiz());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());

        // Modal buttons
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.hideInstructions();
            this.startQuiz();
        });
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideGameOver();
            this.resetQuiz();
            this.startQuiz();
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
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        
        document.getElementById('finalScore').textContent = `${this.score}/${this.totalQuestions}`;
        document.getElementById('finalPoints').textContent = this.points;
        document.getElementById('finalPercentage').textContent = `${percentage}%`;
        
        const performanceMessage = document.getElementById('performanceMessage');
        if (percentage >= 90) {
            performanceMessage.textContent = '🎉 ممتاز! أنت خبير في الحيوانات!';
            performanceMessage.style.background = 'rgba(46, 213, 115, 0.2)';
        } else if (percentage >= 70) {
            performanceMessage.textContent = '👍 جيد جداً! معرفتك بالحيوانات ممتازة!';
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

    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    startQuiz() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.gamePaused = false;
        this.currentQuestion = 0;
        this.score = 0;
        this.points = 0;
        this.questionsAnswered = 0;
        this.updateDisplay();
        this.updateButtons();
        this.showQuestion();
    }

    resetQuiz() {
        this.gameStarted = false;
        this.gamePaused = false;
        this.currentQuestion = 0;
        this.score = 0;
        this.points = 0;
        this.questionsAnswered = 0;
        this.updateDisplay();
        this.updateButtons();
        this.hideQuiz();
        this.shuffleQuestions();
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
        if (this.currentQuestion >= this.totalQuestions) {
            this.endQuiz();
            return;
        }

        const question = this.questions[this.currentQuestion];
        const quizContainer = document.getElementById('quizContainer');
        
        quizContainer.innerHTML = `
            <div class="question">
                <div class="question-image">${question.image}</div>
                <div class="question-text">${question.question}</div>
            </div>
            <div class="answer-options">
                ${question.options.map((option, index) => `
                    <button class="answer-option" data-index="${index}">${option}</button>
                `).join('')}
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(this.currentQuestion / this.totalQuestions) * 100}%"></div>
                </div>
            </div>
            <div class="feedback" id="feedback"></div>
        `;

        // Add event listeners to answer options
        const answerOptions = quizContainer.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', (e) => this.selectAnswer(e));
        });

        quizContainer.classList.remove('hidden');
    }

    selectAnswer(event) {
        if (this.gamePaused) return;
        
        const selectedIndex = parseInt(event.target.getAttribute('data-index'));
        const question = this.questions[this.currentQuestion];
        const isCorrect = selectedIndex === question.correct;
        
        // Disable all options
        const answerOptions = document.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
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
            answerOptions[question.correct].classList.add('correct');
            feedback.textContent = `❌ إجابة خاطئة. الإجابة الصحيحة هي: ${question.options[question.correct]}`;
            feedback.className = 'feedback show incorrect';
        }

        this.questionsAnswered++;
        this.updateDisplay();

        // Move to next question after delay
        setTimeout(() => {
            this.currentQuestion++;
            this.showQuestion();
        }, 2000);
    }

    endQuiz() {
        this.gameStarted = false;
        
        // Calculate bonus points
        const accuracyBonus = Math.round((this.score / this.totalQuestions) * 50);
        this.points += accuracyBonus;
        
        // Add stars based on performance
        let starsEarned = 1;
        if (this.score >= 8) starsEarned++;
        if (this.score >= 9) starsEarned++;
        if (this.points >= 100) starsEarned++;
        
        this.addStars(starsEarned);
        this.updateDisplay();
        this.hideQuiz();
        this.showGameOver();
    }

    hideQuiz() {
        const quizContainer = document.getElementById('quizContainer');
        quizContainer.classList.add('hidden');
    }

    updateDisplay() {
        document.querySelector('.score').textContent = this.score;
        document.querySelector('.question-number').textContent = `${this.currentQuestion + 1}/${this.totalQuestions}`;
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

// Initialize the animal quiz
document.addEventListener('DOMContentLoaded', () => {
    new AnimalQuiz();
}); 