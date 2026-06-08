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
            document.querySelector('.loader-overlay').style.display = 'none';
            // Start Hero Three.js and Entrance Animations
            // if (window.startHeroScene) window.startHeroScene();
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
    return;
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function lerpRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        
        ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
        requestAnimationFrame(lerpRing);
    }
    lerpRing();

    // Hover states
    const interactives = document.querySelectorAll('a, button, .service-card, .magnetic');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width = '56px';
            ring.style.height = '56px';
            ring.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            ring.style.borderColor = 'rgba(255, 255, 255, 0.7)';
            ring.style.mixBlendMode = 'multiply';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width = '32px';
            ring.style.height = '32px';
            ring.style.backgroundColor = 'transparent';
            ring.style.borderColor = 'rgba(255, 255, 255, 0.7)';
            ring.style.mixBlendMode = 'normal';
        });
    });

    window.addEventListener('mousedown', () => dot.style.transform += ' scale(1.5)');
    window.addEventListener('mouseup', () => dot.style.transform = dot.style.transform.replace(' scale(1.5)', ''));
}

// 3. Navbar
function initNavbar() {
    const nav = document.getElementById('main-nav');
    const btn = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-mobile-menu');

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
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggle();
    }, { passive: false });

    document.addEventListener('touchstart', (e) => {
        if (!nav.contains(e.target)) {
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
    
    if (!track || !cards.length) return;
    
    let index = 0;

    function updateCarousel() {
        // Calculate offset for grid layout (3 columns on desktop, 1 on mobile)
        const isMobile = window.innerWidth <= 1024;
        const offset = isMobile ? index * 100 : (index * 100) / 3;
        
        // Simple slide for mobile, maybe just fade or grid shift for desktop
        // But the user's Fix 5 implies a grid of 3.
        // If it's a grid of 3, maybe we don't need a sliding carousel on desktop?
        // Let's stick to simple sliding for now if cards.length > 3.
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        index = (index + 1) % cards.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + cards.length) % cards.length;
        updateCarousel();
    });

    // Auto-scroll
    setInterval(() => {
        index = (index + 1) % cards.length;
        updateCarousel();
    }, 5000);
}

// 6. Booking Form
function initBookingForm() {
    const form = document.getElementById('appointment-form');
    if (!form) return;
    const btn = form.querySelector('.btn-submit');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = form.querySelector('#name').value.trim();
        const email   = form.querySelector('#email').value.trim();
        const phone   = form.querySelector('#phone').value.trim();
        const service = form.querySelector('#service').value;
        const date    = form.querySelector('#date').value;
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !phone || !service || !date) {
            alert('Please fill in all required fields.');
            return;
        }

        const text = 
            `Hello PureSmile Dental, I would like to book an appointment.%0A%0A` +
            `*Name:* ${name}%0A` +
            `*Email:* ${email}%0A` +
            `*Phone:* ${phone}%0A` +
            `*Service:* ${service}%0A` +
            `*Date:* ${date}%0A` +
            `*Message:* ${message || 'N/A'}`;

        const whatsappURL = `https://wa.me/9779741875307?text=${text}`;

        btn.classList.add('success');
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            btn.classList.remove('success');
            form.reset();
        }, 800);
    });
}
