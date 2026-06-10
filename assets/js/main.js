document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not defined. Please check script load order.');
        return;
    }
    
    initLoader();
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
        duration: 1.5,
        ease: 'power2.inOut'
    });

    tl.to('.loader-overlay', {
        opacity: 0,
        duration: 0.6,
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

// 2. Navbar
function initNavbar() {
    const nav = document.getElementById('main-nav');
    const btn = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-links');

    if (!nav || !btn || !menu) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    const toggle = () => {
        const isOpen = menu.classList.toggle('open');
        btn.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    btn.addEventListener('click', toggle);
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    if (menu.classList.contains('open')) toggle();
                    
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetEl.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('open') && !nav.contains(e.target)) {
            toggle();
        }
    });
}

// 3. Magnetic Buttons
function initMagneticButtons() {
    if (window.innerWidth < 1024) return; // Disable on tablet/mobile

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

// 4. Testimonial Carousel
function initCarousel() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    
    if (!track || !cards.length || !nextBtn || !prevBtn) return;
    
    let index = 0;

    function updateCarousel() {
        const gap = 24;
        const moveX = index * (cards[0].offsetWidth + gap);
        
        gsap.to(track, {
            x: -moveX,
            duration: 0.6,
            ease: 'power2.inOut'
        });

        // Update button states
        prevBtn.style.opacity = index === 0 ? '0.3' : '1';
        nextBtn.style.opacity = index >= cards.length - 1 ? '0.3' : '1';
    }

    nextBtn.addEventListener('click', () => {
        if (index < cards.length - 1) {
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
    let startX = 0;
    track.addEventListener('touchstart', (e) => startX = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) nextBtn.click();
        else if (endX - startX > 50) prevBtn.click();
    }, { passive: true });

    window.addEventListener('resize', () => {
        index = 0;
        updateCarousel();
    });
}

// 5. Booking Form
function initBookingForm() {
    const form = document.getElementById('appointment-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const note = document.getElementById('message').value;

        const message = `Hello Shine Dental! Appointment request:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nNote: ${note}`;

        const whatsappNumber = '9779741875307';
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
        
        form.reset();
    });
}
