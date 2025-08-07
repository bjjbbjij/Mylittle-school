// Letters data
const lettersData = {
    'أ': { name: 'ألف', english: 'Alif', sound: 'Alif' },
    'ب': { name: 'باء', english: 'Baa', sound: 'Baa' },
    'ت': { name: 'تاء', english: 'Taa', sound: 'Taa' },
    'ث': { name: 'ثاء', english: 'Thaa', sound: 'Thaa' },
    'ج': { name: 'جيم', english: 'Jeem', sound: 'Jeem' },
    'ح': { name: 'حاء', english: 'Haa', sound: '7aa' },
    'خ': { name: 'خاء', english: 'Khaa', sound: 'Khaa' },
    'د': { name: 'دال', english: 'Dal', sound: 'Dal' },
    'ذ': { name: 'ذال', english: 'Thal', sound: 'Thal' },
    'ر': { name: 'راء', english: 'Raa', sound: 'Raa' },
    'ز': { name: 'زاي', english: 'Zay', sound: 'Zay' },
    'س': { name: 'سين', english: 'Seen', sound: 'Seen' },
    'ش': { name: 'شين', english: 'Sheen', sound: 'Sheen' },
    'ص': { name: 'صاد', english: 'Sad', sound: 'Sad' },
    'ض': { name: 'ضاد', english: 'Dad', sound: 'Dad' },
    'ط': { name: 'طاء', english: 'Ta', sound: 'Ta' },
    'ظ': { name: 'ظاء', english: 'Dhad', sound: 'Dhad' },
    'ع': { name: 'عين', english: 'Ayn', sound: 'Ayn' },
    'غ': { name: 'غين', english: 'Ghayn', sound: 'Ghayn' },
    'ف': { name: 'فاء', english: 'Faa', sound: 'Faa' },
    'ق': { name: 'قاف', english: 'Qaf', sound: 'Qaf' },
    'ك': { name: 'كاف', english: 'Kaf', sound: 'Kaf' },
    'ل': { name: 'لام', english: 'Lam', sound: 'Lam' },
    'م': { name: 'ميم', english: 'Meem', sound: 'Meem' },
    'ن': { name: 'نون', english: 'Noon', sound: 'Noon' },
    'ه': { name: 'هاء', english: 'Haa', sound: 'Haa' },
    'و': { name: 'واو', english: 'Waw', sound: 'Waw' },
    'ي': { name: 'ياء', english: 'Yaa', sound: 'Yaa' }
};

// Global variables
let currentStars = 0;
let learnedLetters = [];
let audioCache = {}; // Cache for audio objects
let currentAudio = null; // متغير لتتبع الصوت الحالي

// DOM elements
const starsCount = document.querySelector('.stars-count');
const stars = document.querySelectorAll('.star');

// قائمة الأصوات المتوفرة فعليًا في مجلد sounds (بدون الامتداد)
const availableSounds = new Set([
  'Alif','Baa','Taa','Thaa','Jeem','7aa','Khaa','Dal','Thal','Raa','Zay','Seen','Sheen','Sad','Dad','Ta','Dhad','Ayn','Ghayn','Faa','Qaf','Kaf','Lam','Meem','Noon','Haa','Waw','Yaa'
]);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadStars();
    loadLearnedLetters();
    setupEventListeners();
    updateStarsDisplay();
    preloadAudioFiles(); // Preload audio files for better performance
});

// Preload audio files
function preloadAudioFiles() {
    Object.values(lettersData).forEach(letterData => {
        const audio = new Audio(`sounds/${letterData.sound}.MP3`);
        audio.preload = 'auto';
        audioCache[letterData.sound] = audio;
    });
}

// Setup event listeners
function setupEventListeners() {
    // Letter card clicks
    document.querySelectorAll('.letter-card').forEach(card => {
        card.addEventListener('click', function() {
            const letter = this.dataset.letter;
            handleLetterClick(letter, this);
        });
        // تحسين التفاعل البصري فقط بدون منع الافتراضي
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    // Listen button clicks
    document.querySelectorAll('.listen-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.letter-card');
            const letter = card.dataset.letter;
            const letterData = lettersData[letter];
            playSound(letterData.sound);
            // تأثير بصري
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.9)';
        });
        btn.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// نافذة تتبع الحرف المنقط
function showTracingModal(letter) {
    // إزالة أي نافذة سابقة
    const oldModal = document.getElementById('tracing-modal');
    if (oldModal) oldModal.remove();

    // إنشاء النافذة
    const modal = document.createElement('div');
    modal.id = 'tracing-modal';
    modal.innerHTML = `
        <div class="tracing-backdrop"></div>
        <div class="tracing-content">
            <button class="tracing-close" aria-label="إغلاق">&times;</button>
            <h2 style="margin-bottom:10px;">اكتب الحرف: <span style="font-size:2rem;">${letter}</span></h2>
            <div id="pen-colors" style="margin-bottom:10px;display:flex;gap:10px;justify-content:center;">
                <button class="pen-color-btn" data-color="#1976d2" style="background:#1976d2;width:32px;height:32px;border-radius:50%;border:2px solid #fff;outline:2px solid #1976d2;cursor:pointer;"></button>
                <button class="pen-color-btn" data-color="#f44336" style="background:#f44336;width:32px;height:32px;border-radius:50%;border:2px solid #fff;outline:none;cursor:pointer;"></button>
                <button class="pen-color-btn" data-color="#388e3c" style="background:#388e3c;width:32px;height:32px;border-radius:50%;border:2px solid #fff;outline:none;cursor:pointer;"></button>
                <button class="pen-color-btn" data-color="#222" style="background:#222;width:32px;height:32px;border-radius:50%;border:2px solid #fff;outline:none;cursor:pointer;"></button>
            </div>
            <canvas id="tracing-canvas" width="320" height="320" style="background:#fff;border-radius:20px;box-shadow:0 2px 10px #0002;touch-action:none;"></canvas>
            <button id="clear-board" style="margin-top:10px;padding:8px 18px;border-radius:12px;background:#f44336;color:#fff;border:none;font-size:1rem;cursor:pointer;">مسح السبورة</button>
        </div>
    `;
    modal.style.cssText = `
        position:fixed;z-index:2000;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;`;
    document.body.appendChild(modal);

    // إغلاق النافذة
    modal.querySelector('.tracing-close').onclick = () => modal.remove();
    modal.querySelector('.tracing-backdrop').onclick = () => modal.remove();

    // سبورة بيضاء للرسم الحر
    const canvas = document.getElementById('tracing-canvas');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    let penColor = '#1976d2';
    ctx.strokeStyle = penColor;
    let drawing = false;
    let last = {x:0, y:0};
    let recentPoints = [];
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches) {
            return {x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top};
        } else {
            return {x: e.offsetX, y: e.offsetY};
        }
    }
    function startDraw(e) {
        drawing = true;
        last = getPos(e);
        recentPoints = [last];
    }
    function endDraw(e) {
        drawing = false;
        recentPoints = [];
    }
    function moveDraw(e) {
        if (!drawing) return;
        const pos = getPos(e);
        recentPoints.push(pos);
        if (recentPoints.length > 3) recentPoints.shift();
        ctx.beginPath();
        if (recentPoints.length === 3) {
            // رسم منحنى بيزيه بين النقاط الثلاثة الأخيرة
            ctx.moveTo(recentPoints[0].x, recentPoints[0].y);
            ctx.quadraticCurveTo(recentPoints[1].x, recentPoints[1].y, recentPoints[2].x, recentPoints[2].y);
        } else {
            ctx.moveTo(last.x, last.y);
            ctx.lineTo(pos.x, pos.y);
        }
        ctx.strokeStyle = penColor;
        ctx.stroke();
        last = pos;
    }
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    canvas.addEventListener('touchmove', function(e){moveDraw(e);e.preventDefault();},{passive:false});
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    canvas.addEventListener('touchend', endDraw);

    // زر مسح السبورة
    document.getElementById('clear-board').onclick = function() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
    };

    // أزرار تغيير اللون
    document.querySelectorAll('.pen-color-btn').forEach(btn => {
        btn.onclick = function() {
            penColor = this.getAttribute('data-color');
            ctx.strokeStyle = penColor;
            // تمييز الزر النشط
            document.querySelectorAll('.pen-color-btn').forEach(b=>b.style.outline='none');
            this.style.outline = `2px solid ${penColor}`;
        };
    });
}

// نقاط الحروف المنقطة (مبسط: دائرة أو نصف دائرة أو خط)
function getLetterDots(letter, cx, cy, r) {
    // يمكن تخصيص كل حرف لاحقًا، الآن: دائرة أو نصف دائرة أو خط
    let arr = [];
    if ('أإآ'.includes(letter)) {
        // خط رأسي
        for (let i=0;i<=8;i++) arr.push({x:cx, y:cy-60+15*i});
    } else if ('ب'.includes(letter)) {
        // نصف دائرة سفلية
        for (let i=0;i<=10;i++) {
            const t = Math.PI + (Math.PI*i/10);
            arr.push({x:cx+Math.cos(t)*r*0.7, y:cy+Math.sin(t)*r*0.7});
        }
    } else if ('تث'.includes(letter)) {
        // نصف دائرة علوية
        for (let i=0;i<=10;i++) {
            const t = (Math.PI*i/10);
            arr.push({x:cx+Math.cos(t)*r*0.7, y:cy+Math.sin(t)*r*0.7});
        }
    } else if ('دذ'.includes(letter)) {
        // قوس يمين
        for (let i=0;i<=10;i++) {
            const t = Math.PI*0.7 + (Math.PI*0.6*i/10);
            arr.push({x:cx+Math.cos(t)*r*0.7, y:cy+Math.sin(t)*r*0.7});
        }
    } else {
        // دائرة افتراضية
        for (let i=0;i<=14;i++) {
            const t = 2*Math.PI*i/14;
            arr.push({x:cx+Math.cos(t)*r*0.7, y:cy+Math.sin(t)*r*0.7});
        }
    }
    return arr;
}

// Show letter information
function showLetterInfo(letter, data) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'letter-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="letter-big">${letter}</div>
            <h3>${data.name}</h3>
            <p>${data.english}</p>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: fadeInOut 2s ease-in-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        .letter-big {
            font-size: 5rem;
            color: #333;
            margin-bottom: 10px;
            font-weight: bold;
        }
        .notification-content h3 {
            color: #333;
            font-size: 1.5rem;
            margin-bottom: 5px;
        }
        .notification-content p {
            color: #666;
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}

// Play sound function - Updated to use actual audio files
function playSound(soundName) {
    try {
        // شغّل فقط إذا كان الصوت متوفر فعليًا
        if (!availableSounds.has(soundName)) {
            return;
        }
        // إيقاف أي صوت قيد التشغيل
        if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        // Check if audio is cached
        let audio;
        if (audioCache[soundName]) {
            audio = audioCache[soundName];
        } else {
            audio = new Audio(`sounds/${soundName}.MP3`);
            audioCache[soundName] = audio;
        }
        currentAudio = audio;
        audio.currentTime = 0; // Reset to beginning
        audio.play().catch(e => {
            // لا تفعل شيئًا إذا فشل التشغيل
        });
        // Add haptic feedback for mobile devices
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    } catch (error) {
        // تجاهل أي خطأ
    }
}

// Star system functions
function addStar() {
    if (currentStars < 5) {
        currentStars++;
        updateStarsDisplay();
        saveStars();
    }
}

function updateStarsDisplay() {
    if (starsCount) {
        starsCount.textContent = currentStars;
    }
    if (stars) {
        stars.forEach((star, index) => {
            if (index < currentStars) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
}

function saveStars() {
    localStorage.setItem('myLittleSchoolStars', currentStars.toString());
}

function loadStars() {
    const savedStars = localStorage.getItem('myLittleSchoolStars');
    if (savedStars) {
        currentStars = parseInt(savedStars);
    }
}

// Learned letters functions
function saveLearnedLetters() {
    localStorage.setItem('myLittleSchoolLearnedLetters', JSON.stringify(learnedLetters));
}

function loadLearnedLetters() {
    const savedLetters = localStorage.getItem('myLittleSchoolLearnedLetters');
    if (savedLetters) {
        learnedLetters = JSON.parse(savedLetters);
        
        // Update visual indicators for learned letters
        learnedLetters.forEach(letter => {
            const card = document.querySelector(`[data-letter="${letter}"]`);
            if (card) {
                card.style.background = 'rgba(76, 175, 80, 0.3)';
                card.style.borderColor = '#4CAF50';
            }
        });
    }
}

// Progress tracking
function getProgress() {
    const totalLetters = Object.keys(lettersData).length;
    const learnedCount = learnedLetters.length;
    const progress = (learnedCount / totalLetters) * 100;
    
    return {
        learned: learnedCount,
        total: totalLetters,
        percentage: Math.round(progress)
    };
}

// Export functions for potential use in other parts of the app
window.lettersModule = {
    getProgress,
    learnedLetters,
    lettersData
};

// دالة إضافة نجوم لرصيد الطفل
function addStars(amount) {
    let stars = parseInt(localStorage.getItem('stars') || '0');
    stars += amount;
    localStorage.setItem('stars', stars);
    // تحديث الرصيد في المتجر إذا كان ظاهرًا
    const el = document.getElementById('stars-balance');
    if (el) el.textContent = stars;
}
// مثال: استدعِ addStars(3) عند كل إجابة صحيحة أو نهاية جولة 

// إعادة تعريف handleLetterClick بشكل صريح وواضح
function handleLetterClick(letter, cardElement) {
    const letterData = lettersData[letter];
    cardElement.style.transform = 'scale(0.95)';
    setTimeout(() => { cardElement.style.transform = ''; }, 150);
    if (!learnedLetters.includes(letter)) {
        learnedLetters.push(letter);
        saveLearnedLetters();
        if (learnedLetters.length % 5 === 0) addStar();
        cardElement.style.background = 'rgba(76, 175, 80, 0.3)';
        cardElement.style.borderColor = '#4CAF50';
    }
    playSound(letterData.sound);
    showTracingModal(letter);
} 