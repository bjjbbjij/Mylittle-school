// تعلم الأرقام - مدرستي الصغيرة (نسخة عربية فقط)

// تحويل رقم إلى أرقام هندية عربية
const arabicIndicDigits = ['0','1','3','3','4','5','6','7','8','9'];
function toArabicIndic(num) {
    return num.toString().split('').map(d => arabicIndicDigits[+d]).join('');
}

// أسماء الأرقام بالعربية
const arabicNames = [
    '', 'واحد','اثنان','ثلاثة','أربعة','خمسة','ستة','سبعة','ثمانية','تسعة','عشرة',
    'أحد عشر','اثنا عشر','ثلاثة عشر','أربعة عشر','خمسة عشر','ستة عشر','سبعة عشر','ثمانية عشر','تسعة عشر','عشرون',
    'واحد وعشرون','اثنان وعشرون','ثلاثة وعشرون','أربعة وعشرون','خمسة وعشرون','ستة وعشرون','سبعة وعشرون','ثمانية وعشرون','تسعة وعشرون','ثلاثون',
    'أربعون','خمسون','ستون','سبعون','ثمانون','تسعون','مائة'
];
const tensArabic = ['', '', 'عشرون','ثلاثون','أربعون','خمسون','ستون','سبعون','ثمانون','تسعون'];
function getArabicName(n) {
    if (n <= 20) return arabicNames[n];
    const tens = Math.floor(n / 10), ones = n % 10;
    if (ones === 0) return tensArabic[tens];
    return arabicNames[ones] + ' و' + tensArabic[tens];
}

// SVG مبسط لطريقة كتابة الأرقام
const svgSamples = {
    1: `<svg width="40" height="60"><line x1="20" y1="10" x2="20" y2="50" stroke="#ffd166" stroke-width="6" stroke-linecap="round"/></svg>`,
    2: `<svg width="40" height="60"><path d="M10,20 Q20,5 30,20 Q30,35 10,50 H30" fill="none" stroke="#ffd166" stroke-width="6" stroke-linecap="round"/></svg>`,
    3: `<svg width="40" height="60"><path d="M10,15 Q30,5 30,20 Q30,35 10,35 Q30,35 30,50 Q30,55 10,45" fill="none" stroke="#ffd166" stroke-width="6" stroke-linecap="round"/></svg>`,
    4: `<svg width="40" height="60"><path d="M30,50 V10 L10,35 H35" fill="none" stroke="#ffd166" stroke-width="6" stroke-linecap="round"/></svg>`,
    5: `<svg width="40" height="60"><path d="M30,10 H10 V30 Q10,50 30,50 Q30,35 10,35" fill="none" stroke="#ffd166" stroke-width="6" stroke-linecap="round"/></svg>`,
    6: `<svg width="40" height="60"><path d="M30,15 Q10,10 10,30 Q10,50 30,50 Q30,35 10,35" fill="none" stroke="#ffd166" stroke-width="6" stroke-linecap="round"/></svg>`,
    7: `<svg width="40" height="60"><path d="M10,10 H30 L10,50" fill="none" stroke="#ffd166" stroke-width="6" stroke-linecap="round"/></svg>`,
    8: `<svg width="40" height="60"><ellipse cx="20" cy="20" rx="10" ry="10" fill="none" stroke="#ffd166" stroke-width="6"/><ellipse cx="20" cy="40" rx="10" ry="10" fill="none" stroke="#ffd166" stroke-width="6"/></svg>`,
    9: `<svg width="40" height="60"><path d="M30,45 Q30,10 10,10 Q10,35 30,35" fill="none" stroke="#ffd166" stroke-width="6" stroke-linecap="round"/></svg>`
};
function getWritingSVG(n) {
    if (svgSamples[n]) return svgSamples[n];
    return `<svg width="40" height="60"><text x="50%" y="50%" text-anchor="middle" fill="#ffd166" font-size="32" dy=".3em">${n}</text></svg>`;
}
function getWritingSteps(n) {
    const steps = {
        0: 'ارسم دائرة مغلقة.',
        1: 'ارسم خطًا رأسيًا من الأعلى للأسفل.',
        2: 'ارسم قوسًا للأعلى ثم خطًا أفقيًا بالأسفل.',
        3: 'ارسم قوسين متتاليين.',
        4: 'ارسم خطين متقاطعين ثم خط أفقي.',
        5: 'ارسم خطًا أفقيًا ثم قوسًا للأسفل.',
        6: 'ابدأ بقوس ثم دائرة صغيرة.',
        7: 'ارسم خطًا أفقيًا ثم مائل للأسفل.',
        8: 'ارسم دائرتين فوق بعض.',
        9: 'ابدأ بدائرة ثم قوس للأسفل.'
    };

    if (n >= 0 && n <= 9) {
        return steps[n];
    } else if (n >= 10 && n <= 99) {
        const digits = n.toString().split('').map(Number);
        return `اكتب الأرقام المكونة للعدد: ${digits.map(d => `(${steps[d] || 'اكتب الرقم بشكل واضح.'})`).join(' ثم ')}`;
    } else if (n === 100) {
        return 'اكتب الرقم 1 ثم 0 ثم 0، أي: (واحد ومئة).';
    } else {
        return 'اكتب الرقم بشكل واضح.';
    }
}


// نطق الرقم بالعربية
function speakNumberArabic(n) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(getArabicName(n));
    utter.lang = 'ar-SA';
    window.speechSynthesis.speak(utter);
}

// إنشاء البطاقات
const numbersList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,40,50,60,70,80,90,100];
window.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('numbersGrid');
    for (const i of numbersList) {
        const card = document.createElement('div');
        card.className = 'number-card';
        card.innerHTML = `
          <div class="big-number">${toArabicIndic(i)}</div>
          <div class="listen-btns">
            <button class="listen-btn listen-arabic" data-number="${i}" title="استمع"><i class="fa-solid fa-volume-high"></i> استمع</button>
          </div>
          <div class="arabic-name"> ${getArabicName(i)} </div>
        `;
        grid.appendChild(card);
    }

grid.addEventListener('click', function(e) {
    const card = e.target.closest('.number-card');
    if (!card) return;

    const num = parseInt(card.querySelector('.listen-btn').getAttribute('data-number'));

    if (e.target.closest('.listen-arabic')) {
        speakNumberArabic(num);
    } else {
        showWritingModal(num);
    }
});

});
function showWritingModal(n) {
    const modal = document.getElementById('writingModal');
    document.getElementById('writingSVG').innerHTML = getWritingSVG(n);
    document.getElementById('writingSteps').textContent = getWritingSteps(n);
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('writingModal').classList.remove('show');
}
function closeModal() {
    document.getElementById('writingModal').classList.remove('show');
}
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
function closeModal() {
    document.getElementById('writingModal').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
});
