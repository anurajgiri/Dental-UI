gsap.registerPlugin(ScrollTrigger);

function initScrollAnimations() {
    // 1. Scroll Progress Bar
    gsap.to('.scroll-progress', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            scrub: 0.3
        }
    });

    // 2. Section Heading Reveal (Split-text effect)
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
            y: '100%',
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: heading,
                start: 'top 85%'
            }
        });
    });

    // 4. About Section Parallax & Content
    gsap.to('.parallax', {
        y: (i, el) => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0.4;
            return -100 * speed;
        },
        ease: 'none',
        scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.from('.about-content', {
        x: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.about-container',
            start: 'top 70%'
        }
    });

    // 5. Stats Counter
    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const increment = target / 80;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 25);
    }

    const statsSection = document.querySelector('#stats');
    if (statsSection) {
        ScrollTrigger.create({
            trigger: statsSection,
            start: 'top 80%',
            onEnter: () => {
                const patientsEl = statsSection.querySelector('[data-target="500"]');
                const yearsEl = statsSection.querySelector('[data-target="20"]');
                const doctorsEl = statsSection.querySelector('[data-target="15"]');
                const satisfactionEl = statsSection.querySelector('[data-target="98"]');

                if (patientsEl) animateCounter(patientsEl, 500, '+');
                if (yearsEl) animateCounter(yearsEl, 20, '');
                if (doctorsEl) animateCounter(doctorsEl, 15, '');
                if (satisfactionEl) animateCounter(satisfactionEl, 98, '%');
            },
            once: true
        });
    }

    // 6. Process Line Drawing & Steps
    const processPath = document.querySelector('.process-line-svg path');
    if (processPath) {
        gsap.to(processPath, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.process-wrapper',
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 1
            }
        });
    }

    gsap.from('.process-step', {
        y: 40,
        opacity: 0,
        stagger: 0.3,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 70%'
        }
    });

    // 7. Background Shift
    const sectionColors = {
      hero: '#4A86D4',
      services: '#FFFFFF',
      about: '#4A86D4',
      stats: '#3D78C0',
      process: '#FFFFFF',
      testimonials: '#4A86D4',
      booking: '#FFFFFF',
      footer: '#3D78C0'
    };

    const sections = ['#hero', '#services', '#about', '#stats', '#process', '#testimonials', '#booking'];
    sections.forEach(id => {
        const section = document.querySelector(id);
        if (!section) return;
        
        const key = id.replace('#', '');
        const targetColor = sectionColors[key];
        const isDark = targetColor === '#4A86D4' || targetColor === '#3D78C0';
        
        ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            onEnter: () => updateBg(targetColor, isDark),
            onEnterBack: () => updateBg(targetColor, isDark)
        });
    });

    function updateBg(bgColor, isDark) {
        gsap.to('body', {
            backgroundColor: bgColor,
            color: isDark ? '#ffffff' : '#0D3D52',
            duration: 0.8
        });
    }
}

window.initScrollAnimations = initScrollAnimations;
