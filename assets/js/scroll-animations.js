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

    // 3. Services Grid Stagger
    gsap.from('.service-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%'
        }
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
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        gsap.to(stat, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: '#stats',
                start: 'top 80%'
            },
            onUpdate: function() {
                if (target === 500 || target === 98) {
                    stat.innerText = Math.floor(this.targets()[0].innerText) + (target === 500 ? '+' : '%');
                }
            }
        });
    });

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
      hero: '#EAF6FB',
      services: '#FFFFFF', 
      about: '#E4F3FA',
      stats: '#0D3D52',
      process: '#FFFFFF',
      testimonials: '#E4F3FA',
      booking: '#FFFFFF'
    };

    const sections = ['#hero', '#services', '#about', '#stats', '#process', '#testimonials', '#booking'];
    sections.forEach(id => {
        const section = document.querySelector(id);
        if (!section) return;
        
        const key = id.replace('#', '');
        const targetColor = sectionColors[key];
        const isDark = targetColor === '#0D3D52';
        
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
        
        const nav = document.getElementById('main-nav');
        if (isDark) {
            nav.querySelector('.logo').style.color = '#ffffff';
            nav.querySelectorAll('.nav-link').forEach(l => l.style.color = '#ffffff');
        } else if (!nav.classList.contains('scrolled')) {
            nav.querySelector('.logo').style.color = '#0D3D52';
            nav.querySelectorAll('.nav-link').forEach(l => l.style.color = '#0D3D52');
        }
    }
}

window.initScrollAnimations = initScrollAnimations;
