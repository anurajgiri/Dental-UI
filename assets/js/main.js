document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNavbar();
    initMagneticButtons();
    initCarousel();
    initBookingForm();
});

// 1. Page Loader
function initLoader() {
    const tl = gsap.timeline();
    
    tl.to('.loader-progress-bar', {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut'
    });

    tl.to('.loader-overlay', {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
            const loader = document.querySelector('.loader-overlay');
            if (loader) loader.style.display = 'none';
            if (window.initScrollAnimations) window.initScrollAnimations();
            triggerHeroEntrance();
        }
    });
}

function triggerHeroEntrance() {
    const tl = gsap.timeline();
    tl.from('.badge', { y: 20, opacity: 0, duration: 0.6 })
      .from('#hero h1', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('#hero p', { y: 20, opacity: 0, duration: 0.6 }, '-=0.6')
      .from('.hero-actions', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.social-proof', { opacity: 0, duration: 0.6 }, '-=0.4');
}

// 2. Custom Cursor
function initCursor() {
    // Disabled as per original logic (return early)
    return;
}

// 3. Navbar
function initNavbar() {
    const nav = document.getElementById('main-nav');
    const btn = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-links');

    if (!nav || !btn || !menu) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    const toggle = () => {
        const isOpen = btn.classList.toggle('open');
        menu.classList.toggle('open', isOpen);
    };

    btn.addEventListener('click', toggle);
    
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                    // Close mobile menu
                    btn.classList.remove('open');
                    menu.classList.remove('open');
                }
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && menu.classList.contains('open')) {
            btn.classList.remove('open');
            menu.classList.remove('open');
        }
    });
}

// 4. Magnetic Buttons
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// 5. Testimonial Carousel
function initCarousel() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    
    if (!track || !cards.length || !nextBtn || !prevBtn) return;
    
    let index = 0;
    let startX = 0;
    let isDragging = false;

    function getVisibleCards() {
        if (window.innerWidth <= 767) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visibleCards);
        
        if (index > maxIndex) index = maxIndex;
        if (index < 0) index = 0;

        const cardWidth = cards[0].offsetWidth;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 32;
        const moveX = index * (cardWidth + gap);
        
        track.style.transform = `translateX(-${moveX}px)`;

        // Update button states
        prevBtn.style.opacity = index === 0 ? '0.5' : '1';
        prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
        nextBtn.style.opacity = index >= maxIndex ? '0.5' : '1';
        nextBtn.style.pointerEvents = index >= maxIndex ? 'none' : 'auto';
    }

    nextBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        if (index < cards.length - visibleCards) {
            index++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (index > 0) {
            index--;
            updateCarousel();
        }
    });

    // Touch Support
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextBtn.click();
            else prevBtn.click();
            isDragging = false;
        }
    }, { passive: true });

    track.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Keyboard Access
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'ArrowLeft') prevBtn.click();
    });

    // Window Resize handling
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCarousel, 250);
    });

    // Initial State
    updateCarousel();
}

// 6. Booking Form
function initBookingForm() {
    const form = document.getElementById('appointment-form');
    if (!form) return;

    const dateInput = form.querySelector('input[type="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name       = (form.querySelector('#name, input[name="name"]')?.value || '').trim();
        const email      = (form.querySelector('#email, input[name="email"]')?.value || '').trim();
        const userPhone  = (form.querySelector('#phone, input[name="phone"]')?.value || '').trim();
        const service    = (form.querySelector('#service, select[name="service"]')?.value || '').trim();
        const date       = (form.querySelector('#date, input[name="date"]')?.value || '').trim();
        const message    = (form.querySelector('#message, textarea[name="message"]')?.value || '').trim();

        if (!name || !email || !userPhone || !service || !date) {
            alert('Please fill in all required fields.');
            return;
        }

        const clinicPhone = '9779741875307';
        const msgLines = [
          'Hello Shine Dental! Appointment request:',
          '',
          'Name: ' + name,
          'Email: ' + email,
          'Phone: ' + userPhone,
          'Service: ' + service,
          'Date: ' + date,
          'Note: ' + (message || 'N/A')
        ].join('\n');
        
        const encodedMsg = encodeURIComponent(msgLines);
        let url = '';

        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            url = 'https://wa.me/' + clinicPhone + '?text=' + encodedMsg;
        } else {
            url = 'https://web.whatsapp.com/send?phone=' + clinicPhone + '&text=' + encodedMsg;
        }
        
        window.open(url, '_blank');
        form.reset();
    });
}
