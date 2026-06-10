class DentalScene {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        if (!this.canvas) return;

        this.isMobile = window.innerWidth < 480;
        this.particleCount = this.isMobile ? 80 : 200;
        
        this.init();
        this.createTooth();
        this.createParticles();
        this.initScrollAnimations();
        this.animate();
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    init() {
        this.scene = new THREE.Scene();
        
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: !this.isMobile
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(5, 5, 5);
        this.scene.add(spotLight);

        const pointLight = new THREE.PointLight(0x00BFA5, 1.5);
        pointLight.position.set(-5, -5, 2);
        this.scene.add(pointLight);
    }

    createTooth() {
        this.toothGroup = new THREE.Group();
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 100,
            specular: 0x444444
        });

        // Simplified Tooth Shape
        const bodyGeo = new THREE.CylinderGeometry(0.8, 0.6, 1.2, this.isMobile ? 16 : 32);
        const body = new THREE.Mesh(bodyGeo, material);
        this.toothGroup.add(body);

        const topGeo = new THREE.SphereGeometry(0.8, this.isMobile ? 12 : 24, this.isMobile ? 12 : 24);
        const top = new THREE.Mesh(topGeo, material);
        top.position.y = 0.5;
        top.scale.y = 0.6;
        this.toothGroup.add(top);

        // Add 4 mini "cusps"
        const cuspGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const positions = [[0.4, 0.8, 0.4], [-0.4, 0.8, 0.4], [0.4, 0.8, -0.4], [-0.4, 0.8, -0.4]];
        positions.forEach(pos => {
            const cusp = new THREE.Mesh(cuspGeo, material);
            cusp.position.set(...pos);
            this.toothGroup.add(cusp);
        });

        this.toothGroup.position.set(2, 0, 0); // Position to the side on desktop
        if (this.isMobile) this.toothGroup.position.set(0, 0, -1);

        this.scene.add(this.toothGroup);
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const color1 = new THREE.Color('#A8EDEA');
        const color2 = new THREE.Color('#00BFA5');

        for (let i = 0; i < this.particleCount; i++) {
            vertices.push(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
            );

            const mixedColor = color1.clone().learn(color2, Math.random());
            colors.push(mixedColor.r, mixedColor.g, mixedColor.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: this.isMobile ? 0.08 : 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Scroll Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });

        tl.to(this.toothGroup.rotation, {
            y: Math.PI * 2,
            x: Math.PI * 0.2,
            ease: "none"
        }, 0);

        tl.to(this.camera.position, {
            z: this.isMobile ? 3 : 4,
            ease: "none"
        }, 0);

        // Move tooth based on sections if needed, but keeping it simple for now
        tl.to(this.toothGroup.position, {
            x: this.isMobile ? 0 : -2,
            y: this.isMobile ? -0.5 : 0,
            ease: "power1.inOut"
        }, 0);
    }

    onWindowResize() {
        this.isMobile = window.innerWidth < 480;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        if (this.toothGroup) {
            this.toothGroup.position.y += Math.sin(time) * 0.001;
        }

        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
            this.particleSystem.rotation.x += 0.0005;
            
            // Subtle drift
            const positions = this.particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + positions[i]) * 0.002;
            }
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Add lerp to THREE.Color if it doesn't exist or just use a helper
THREE.Color.prototype.learn = function(color, amount) {
    this.r += (color.r - this.r) * amount;
    this.g += (color.g - this.g) * amount;
    this.b += (color.b - this.b) * amount;
    return this;
};

document.addEventListener('DOMContentLoaded', () => {
    window.dentalScene = new DentalScene();
});
