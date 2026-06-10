class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isMobile = window.innerWidth < 480;
        this.count = this.isMobile ? 60 : 150;
        this.speedMultiplier = 1;
        this.opacityMultiplier = 1;
        
        this.init();
        this.animate();
        this.initScrollTrigger();
        
        window.addEventListener('resize', () => this.onResize());
    }

    init() {
        this.onResize();
        this.particles = [];
        // Updated colors for light background visibility (Dark Teal/Navy)
        const colors = ['#0d2137', '#00BFA5', '#0077B6', '#1a2f4a'];
        
        for (let i = 0; i < this.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * (this.isMobile ? 1.5 : 2.5) + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.5 + 0.3,
                amplitude: Math.random() * 1.5,
                frequency: Math.random() * 0.02,
                offset: Math.random() * 100
            });
        }
    }

    onResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.isMobile = window.innerWidth < 480;
    }

    initScrollTrigger() {
        if (!window.gsap || !window.ScrollTrigger) return;
        
        gsap.to(this, {
            speedMultiplier: 2.5,
            opacityMultiplier: 1.5,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            // Update position
            p.y -= p.speedY * this.speedMultiplier;
            p.x += Math.sin(p.y * p.frequency + p.offset) * p.amplitude;
            
            // Loop particles
            if (p.y < -10) {
                p.y = this.canvas.height + 10;
                p.x = Math.random() * this.canvas.width;
            }
            
            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity * Math.min(this.opacityMultiplier, 1);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.particleBg = new ParticleBackground();
});
