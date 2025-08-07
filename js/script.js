// ملف جافاسكريبت للصفحة الرئيسية (index.html)
// تحسينات للتفاعل مع الهواتف المحمولة

// تحسين التفاعل اللمسي للأزرار
document.addEventListener('DOMContentLoaded', function() {
  // إضافة تأثير الاهتزاز للأزرار عند اللمس
  const buttons = document.querySelectorAll('.main-btn');
  
  buttons.forEach(button => {
    // إضافة تأثير اللمس
    button.addEventListener('touchstart', function(e) {
      this.style.transform = 'scale(0.95)';
      this.style.transition = 'transform 0.1s ease';
      
      // إضافة اهتزاز إذا كان متاحاً
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
    
    button.addEventListener('touchend', function(e) {
      this.style.transform = 'scale(1)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    // منع التحديد المزدوج
    button.addEventListener('dblclick', function(e) {
      e.preventDefault();
    });
  });
  
  // تحسين التفاعل مع الصورة
  const heroImage = document.querySelector('.hero-illustration img');
  if (heroImage) {
    heroImage.addEventListener('touchstart', function(e) {
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    heroImage.addEventListener('touchend', function(e) {
      this.style.transform = 'scale(1)';
      this.style.transition = 'transform 0.3s ease';
    });
  }
  
  // منع التكبير على الأجهزة المحمولة
  document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  });
  
  document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
  });
  
  document.addEventListener('gestureend', function(e) {
    e.preventDefault();
  });
  
  // تحسين الأداء على الأجهزة المحمولة
  let isScrolling = false;
  
  window.addEventListener('scroll', function() {
    if (!isScrolling) {
      isScrolling = true;
      requestAnimationFrame(function() {
        isScrolling = false;
      });
    }
  });
  
  // إضافة دعم للوضع المظلم إذا كان متاحاً
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  }
  
  // مراقبة تغييرات الوضع المظلم
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (e.matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
  
  // تحسين التحميل للأجهزة المحمولة
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      // يمكن إضافة Service Worker هنا لتحسين الأداء
      console.log('Service Worker supported');
    });
  }
  
  // إضافة تأثيرات بصرية للأجهزة المحمولة
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // إضافة تأثيرات خاصة للأجهزة المحمولة
    document.body.classList.add('mobile-device');
    
    // تحسين التفاعل مع الشاشة
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
      touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartY - touchEndY;
      
      if (Math.abs(diff) > swipeThreshold) {
        // يمكن إضافة منطق للتنقل بالسحب هنا
        console.log('Swipe detected');
      }
    }
  }
  
  // تحسين إمكانية الوصول
  document.addEventListener('keydown', function(e) {
    // دعم التنقل بلوحة المفاتيح
    if (e.key === 'Enter' || e.key === ' ') {
      const focusedElement = document.activeElement;
      if (focusedElement && focusedElement.classList.contains('main-btn')) {
        focusedElement.click();
      }
    }
  });
  
  // إضافة مؤشر تحميل للأجهزة المحمولة
  window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
      loader.style.display = 'none';
    }
  });
});

// تحسين الأداء العام
window.addEventListener('load', function() {
  // تحسين الصور
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
      this.style.display = 'none';
    });
  });
});

// ====== شريط النجوم الدائم أعلى الصفحة ======
function createStarsBar() {
    if (document.getElementById('stars-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'stars-bar';
    bar.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:48px;background:linear-gradient(90deg,#fffde7,#ffe082 80%);z-index:2000;display:flex;align-items:center;justify-content:flex-end;padding:0 24px;box-shadow:0 2px 12px #ffd60055;transition:top 0.3s;';
    bar.innerHTML = `
        <img src='images/download.png' style='width:32px;height:32px;margin-left:10px;'>
        <span style='font-size:1.2em;font-weight:bold;color:#bfa100;'>
            <span id="stars-bar-balance">${getStars()}</span> ⭐
        </span>
    `;
    document.body.appendChild(bar);
    document.body.style.paddingTop = '48px';
}
function updateStarsBar() {
    const el = document.getElementById('stars-bar-balance');
    if (el) el.textContent = getStars();
}
window.addEventListener('DOMContentLoaded', () => {
    createStarsBar();
    updateStarsBar();
});
// تحديث الشريط عند تغيير النجوم
const oldSetStars = setStars;
setStars = function(val) {
    oldSetStars(val);
    updateStarsBar();
};

// إدارة النجوم
function getStars() {
    return parseInt(localStorage.getItem('stars') || '50'); // رصيد افتراضي 50
}
function setStars(val) {
    localStorage.setItem('stars', val);
    const el = document.getElementById('stars-bar-balance');
    if (el) el.textContent = val;
}
