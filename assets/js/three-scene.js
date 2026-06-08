let scene, camera, renderer, toothGroup, particles;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
const isMobile = window.innerWidth < 768;

function initThree() {
    const canvas = document.getElementById('dental-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();

    const aspect = canvas.clientWidth / canvas.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateRendererSize();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const tealLight = new THREE.PointLight(0x00C4A1, 2.0, 10);
    tealLight.position.set(-3, 2, 2);
    scene.add(tealLight);

    const warmLight = new THREE.PointLight(0xF4A261, 1.5, 8);
    warmLight.position.set(3, -2, 1);
    scene.add(warmLight);

    // Create Tooth Model
    createTooth();
    
    // Create Particles
    createParticles();

    // Event Listeners
    if (!isMobile) {
        window.addEventListener('mousemove', onMouseMove);
    }
    window.addEventListener('resize', onWindowResize);

    animate();
}

function createTooth() {
    toothGroup = new THREE.Group();

    const toothMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        shininess: 120,
        specular: 0x00C4A1
    });

    // Crown (Body)
    const crownGeo = new THREE.CylinderGeometry(0.8, 1.0, 1.8, 32);
    const crown = new THREE.Mesh(crownGeo, toothMaterial);
    toothGroup.add(crown);

    // Cusps (Top)
    const cuspPositions = [
        {x: 0.4, z: 0.4}, {x: -0.4, z: 0.4},
        {x: 0.4, z: -0.4}, {x: -0.4, z: -0.4}
    ];
    const cuspGeo = new THREE.SphereGeometry(0.25, 16, 16);
    cuspPositions.forEach(pos => {
        const cusp = new THREE.Mesh(cuspGeo, toothMaterial);
        cusp.position.set(pos.x, 0.9, pos.z);
        toothGroup.add(cusp);
    });

    // Roots
    const rootGeo = new THREE.ConeGeometry(0.18, 1.2, 16);
    const rootPositions = [
        {x: 0.4, y: -1.2, z: 0},
        {x: -0.3, y: -1.2, z: 0.3},
        {x: -0.3, y: -1.2, z: -0.3}
    ];
    rootPositions.forEach(pos => {
        const root = new THREE.Mesh(rootGeo, toothMaterial);
        root.position.set(pos.x, pos.y, pos.z);
        root.rotation.x = Math.PI;
        toothGroup.add(root);
    });

    scene.add(toothGroup);
}

function createParticles() {
    const particleCount = isMobile ? 60 : 200;
    particles = [];
    const particleGeo = new THREE.SphereGeometry(0.03, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({
        color: 0x00C4A1,
        transparent: true,
        opacity: 0.7
    });

    for (let i = 0; i < particleCount; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        
        // Random spherical coordinates
        const radius = 2.5 + Math.random() * 1.5;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;

        p.userData = {
            radius: radius,
            phi: phi,
            theta: theta,
            speed: (0.005 + Math.random() * 0.01)
        };

        scene.add(p);
        particles.push(p);
    }
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    targetRotationY = mouseX * 0.5;
    targetRotationX = -mouseY * 0.3;
}

function onWindowResize() {
    updateRendererSize();
}

function updateRendererSize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (document.visibilityState !== 'visible') return;

    const time = Date.now() * 0.001;

    if (toothGroup) {
        // Continuous rotation
        toothGroup.rotation.y += 0.005;
        
        // Floating effect
        toothGroup.position.y = Math.sin(time) * 0.15;

        // Mouse Parallax Easing
        if (!isMobile) {
            toothGroup.rotation.x += (targetRotationX - toothGroup.rotation.x) * 0.05;
            toothGroup.rotation.y += (targetRotationY - toothGroup.rotation.y) * 0.05;
        }
    }

    // Particles Orbit
    particles.forEach(p => {
        p.userData.phi += p.userData.speed;
        
        p.position.x = p.userData.radius * Math.sin(p.userData.theta) * Math.cos(p.userData.phi);
        p.position.y = p.userData.radius * Math.sin(p.userData.theta) * Math.sin(p.userData.phi);
        p.position.z = p.userData.radius * Math.cos(p.userData.theta);
    });

    renderer.render(scene, camera);
}

// Start Three.js only after explicit call from main.js
window.startHeroScene = initThree;
