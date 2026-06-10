gsap.registerPlugin(ScrollTrigger);

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

    // 5. Background Shift Logic
    const sections = [
        { id: '#hero', color: 'transparent', text: '#ffffff' },
        { id: '#services', color: 'rgba(255,255,255,0.95)', text: '#0D3D52' },
        { id: '#about', color: 'transparent', text: '#ffffff' },
        { id: '#stats', color: 'rgba(10, 15, 30, 0.8)', text: '#ffffff' },
        { id: '#process', color: 'rgba(255,255,255,0.95)', text: '#0D3D52' },
        { id: '#testimonials', color: 'transparent', text: '#ffffff' },
        { id: '#booking', color: 'rgba(255,255,255,0.95)', text: '#0D3D52' }
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
    gsap.from('.service-card, .process-step', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
            trigger: '.services-grid, .process-grid',
            start: 'top 85%'
        }
    });
}

window.initScrollAnimations = initScrollAnimations;
