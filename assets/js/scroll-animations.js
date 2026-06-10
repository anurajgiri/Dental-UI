document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initScrollAnimations();
    }
});

function initScrollAnimations() {
    const isMobile = window.innerWidth < 768;

    // 1. Scroll Progress Bar
    gsap.to('.scroll-progress', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            scrub: 0.3
        }
    });

    // 2. Section Heading Reveal
    document.querySelectorAll('.reveal-text').forEach(heading => {
        const text = heading.textContent;
        heading.innerHTML = '';
        text.split(' ').forEach(word => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.display = 'inline-block';
            heading.appendChild(span);
        });

        gsap.from(heading.querySelectorAll('span'), {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: heading,
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    });

    // 3. Floating Hero Elements
    if (!isMobile) {
        gsap.to('.hero-img-frame', {
            y: -50,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // 4. Stats Counter
    const animateCounter = (el, target, suffix = '') => {
        let obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                el.textContent = Math.floor(obj.val) + suffix;
            },
            scrollTrigger: {
                trigger: el,
                start: 'top 90%'
            }
        });
    };

    const statsSection = document.querySelector('#stats');
    if (statsSection) {
        statsSection.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-target') === '500' ? '+' : 
                          (stat.getAttribute('data-target') === '98' ? '%' : '');
            animateCounter(stat, target, suffix);
        });
    }

    // 5. Background Shift Logic - Updated for Light Theme
    const sections = [
        { id: '#hero', color: 'transparent', text: '#1a2332' },
        { id: '#services', color: 'rgba(235, 245, 251, 0.95)', text: '#4a5568' },
        { id: '#about', color: 'transparent', text: '#4a5568' },
        { id: '#stats', color: 'rgba(221, 238, 255, 0.8)', text: '#1a2332' },
        { id: '#process', color: 'rgba(235, 245, 251, 0.95)', text: '#4a5568' },
        { id: '#testimonials', color: 'transparent', text: '#4a5568' },
        { id: '#booking', color: 'rgba(235, 245, 251, 0.95)', text: '#4a5568' }
    ];

    sections.forEach(sec => {
        const el = document.querySelector(sec.id);
        if (!el) return;

        ScrollTrigger.create({
            trigger: el,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: self => {
                if (self.isActive) {
                    gsap.to(el, {
                        backgroundColor: sec.color,
                        duration: 0.6,
                        overwrite: 'auto'
                    });
                    gsap.to('body', {
                        color: sec.text,
                        duration: 0.6,
                        overwrite: 'auto'
                    });
                }
            }
        });
    });

    // 6. Card Reveal
    gsap.fromTo('.service-card, .process-step', 
        { y: 30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            visibility: 'visible',
            stagger: 0.1,
            duration: 0.6,
            scrollTrigger: {
                trigger: '.services-grid, .process-grid',
                start: 'top 85%',
                once: true
            }
        }
    );
}

window.initScrollAnimations = initScrollAnimations;
