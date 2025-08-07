// Colors data
const colorsData = {
    'أحمر': { name: 'أحمر', english: 'Red', sound: 'ahmar', hex: '#FF0000' },
    'أزرق': { name: 'أزرق', english: 'Blue', sound: 'azraq', hex: '#0000FF' },
    'أزرق سماوي': { name: 'أزرق سماوي', english: 'Sky Blue', sound: 'azraq samawi', hex: '#4fd3ff' },
    'أصفر': { name: 'أصفر', english: 'Yellow', sound: 'asfar', hex: '#FFFF00' },
    'أخضر': { name: 'أخضر', english: 'Green', sound: 'akhdar', hex: '#00FF00' },
    'برتقالي': { name: 'برتقالي', english: 'Orange', sound: 'burtuqali', hex: '#FFA500' },
    'بنفسجي': { name: 'بنفسجي', english: 'Purple', sound: 'banafsaji', hex: '#800080' },
    'وردي': { name: 'وردي', english: 'Pink', sound: 'wardi', hex: '#FFC0CB' },
    'بني': { name: 'بني', english: 'Brown', sound: 'bunni', hex: '#A52A2A' },
    'أسود': { name: 'أسود', english: 'Black', sound: 'aswad', hex: '#000000' },
    'أبيض': { name: 'أبيض', english: 'White', sound: 'abyad', hex: '#FFFFFF' },
    'فيروزي': { name: 'فيروزي', english: 'Turquoise', sound: 'firuzi', hex: '#00D2D3' }
};

// Global variables
let currentStars = 0;
let learnedColors = [];

// DOM elements
const starsCount = document.querySelector('.stars-count');
const stars = document.querySelectorAll('.star');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadStars();
    loadLearnedColors();
    setupEventListeners();
    updateStarsDisplay();
});

// Setup event listeners
function setupEventListeners() {
    // Color card clicks: فقط تأثير بصري وتعلّم اللون
    document.querySelectorAll('.color-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // إذا كان الضغط على زر الاستماع، تجاهل
            if (e.target.classList.contains('listen-btn')) return;
            const color = this.dataset.color;
            handleColorClick(color, this);
        });
    });
    // أزرار الاستماع
    document.querySelectorAll('.listen-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // لا تشغل حدث البطاقة
            const card = this.closest('.color-card');
            const color = card.dataset.color;
            playSound(colorsData[color].sound, this);
        });
    });
}

// Handle color card click
function handleColorClick(color, cardElement) {
    // فقط تأثير بصري وتعلّم اللون، لا صوت ولا showColorInfo
    // Add visual feedback
    cardElement.style.transform = 'scale(0.95)';
    setTimeout(() => {
        cardElement.style.transform = '';
    }, 150);
    // Mark as learned if not already
    if (!learnedColors.includes(color)) {
        learnedColors.push(color);
        saveLearnedColors();
        // Add star if we have a new color
        if (learnedColors.length % 2 === 0) {
            addStar();
        }
        // Add learned visual indicator
        cardElement.style.background = 'rgba(76, 175, 80, 0.3)';
        cardElement.style.borderColor = '#4CAF50';
    }
    // لا صوت ولا showColorInfo
    // Animate color display
    animateColorDisplay(cardElement, colorsData[color].hex);
}

// Show color information
function showColorInfo(color, data) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'color-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="color-big" style="background-color: ${data.hex}; border: 2px solid #ddd;"></div>
            <h3>${data.name}</h3>
            <p>${data.english}</p>
            <div class="hex-code">${data.hex}</div>
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
        .color-big {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin: 0 auto 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .notification-content h3 {
            color: #333;
            font-size: 1.5rem;
            margin-bottom: 5px;
        }
        .notification-content p {
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 10px;
        }
        .hex-code {
            font-family: monospace;
            font-size: 1rem;
            color: #999;
            background: #f5f5f5;
            padding: 5px 10px;
            border-radius: 5px;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}

// Animate color display
function animateColorDisplay(cardElement, hexColor) {
    const colorDisplay = cardElement.querySelector('.color-display');
    const examples = cardElement.querySelectorAll('.example-item');
    
    // Animate main color display
    colorDisplay.style.transform = 'scale(1.2) rotate(360deg)';
    colorDisplay.style.boxShadow = `0 0 30px ${hexColor}`;
    
    setTimeout(() => {
        colorDisplay.style.transform = '';
        colorDisplay.style.boxShadow = '';
    }, 600);
    
    // Animate example colors
    examples.forEach((example, index) => {
        setTimeout(() => {
            example.style.transform = 'scale(1.3)';
            example.style.boxShadow = `0 0 10px ${hexColor}`;
            
            setTimeout(() => {
                example.style.transform = '';
                example.style.boxShadow = '';
            }, 300);
        }, index * 200);
    });
}

// تحسين تشغيل الصوت ومنع التداخل
let currentAudio = null;
function playSound(soundName, btn) {
    // أوقف الصوت السابق
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    // تأثير بصري للزر
    if (btn) {
        btn.classList.add('playing');
        setTimeout(() => btn.classList.remove('playing'), 400);
    }
    // تشغيل الصوت الفعلي إذا كان الملف موجودًا
    const audio = new Audio(`../../sounds/colors/${soundName}.mp3`);
    currentAudio = audio;
    audio.play().catch(e => {
        // fallback: Web Speech API
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(soundName);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    });
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
    starsCount.textContent = currentStars;
    stars.forEach((star, index) => {
        if (index < currentStars) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
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

// Learned colors functions
function saveLearnedColors() {
    localStorage.setItem('myLittleSchoolLearnedColors', JSON.stringify(learnedColors));
}

function loadLearnedColors() {
    const savedColors = localStorage.getItem('myLittleSchoolLearnedColors');
    if (savedColors) {
        learnedColors = JSON.parse(savedColors);
        
        // Update visual indicators for learned colors
        learnedColors.forEach(color => {
            const card = document.querySelector(`[data-color="${color}"]`);
            if (card) {
                card.style.background = 'rgba(76, 175, 80, 0.3)';
                card.style.borderColor = '#4CAF50';
            }
        });
    }
}

// Progress tracking
function getProgress() {
    const totalColors = Object.keys(colorsData).length;
    const learnedCount = learnedColors.length;
    const progress = (learnedCount / totalColors) * 100;
    
    return {
        learned: learnedCount,
        total: totalColors,
        percentage: Math.round(progress)
    };
}

// Color mixing helper
function mixColors(color1, color2) {
    const colorMap = {
        'أحمر': '#FF0000',
        'أزرق': '#0000FF',
        'أصفر': '#FFFF00',
        'أخضر': '#00FF00',
        'برتقالي': '#FFA500',
        'بنفسجي': '#800080',
        'وردي': '#FFC0CB',
        'بني': '#A52A2A',
        'أسود': '#000000',
        'أبيض': '#FFFFFF'
    };
    
    const hex1 = colorMap[color1];
    const hex2 = colorMap[color2];
    
    if (hex1 && hex2) {
        // Simple color mixing (average RGB values)
        const r1 = parseInt(hex1.slice(1, 3), 16);
        const g1 = parseInt(hex1.slice(3, 5), 16);
        const b1 = parseInt(hex1.slice(5, 7), 16);
        
        const r2 = parseInt(hex2.slice(1, 3), 16);
        const g2 = parseInt(hex2.slice(3, 5), 16);
        const b2 = parseInt(hex2.slice(5, 7), 16);
        
        const r = Math.round((r1 + r2) / 2);
        const g = Math.round((g1 + g2) / 2);
        const b = Math.round((b1 + b2) / 2);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    return null;
}

// Color game helper
function startColorGame() {
    const randomColor = Object.keys(colorsData)[Math.floor(Math.random() * Object.keys(colorsData).length)];
    
    const card = document.querySelector(`[data-color="${randomColor}"]`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            handleColorClick(randomColor, card);
        }, 500);
    }
}

// Export functions for potential use in other parts of the app
window.colorsModule = {
    getProgress,
    learnedColors,
    colorsData,
    mixColors,
    startColorGame
}; 