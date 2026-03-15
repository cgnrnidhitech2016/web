// Typing effect
const words = ["Gold Loans", "Secure Deposits", "Member Savings", "Quick Approval"];
let wordIndex = 0;
setInterval(() => {
    const el = document.querySelector(".scroll-text");
    if (el) {
        wordIndex = (wordIndex + 1) % words.length;
        el.style.opacity = 0;
        setTimeout(() => {
            el.innerText = words[wordIndex];
            el.style.opacity = 1;
            el.style.transition = 'opacity 0.5s ease';
            el.style.color = "#ffd700";
            el.style.fontWeight = "bold";
            el.style.fontSize = "50px";
        }, 500);
    }
}, 3000);



// Three.js 3D Background
function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    if (typeof THREE === 'undefined') {
        console.error("Three.js not loaded!");
        return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a192f, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles/Nodes
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 800;

    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 120;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xffd700,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // 3D Gold Coins
    const shapes = [];

    // Create a coin geometry (cylinder with very small height)
    // Increased size significantly
    const coinGeometry = new THREE.CylinderGeometry(4, 4, 0.5, 64);

    // Load the logo texture
    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load('images/logo.png');

    // Create materials for the coin. 
    // We use a multi-material approach: one for the edge (standard gold), one for the flat faces (gold with logo)
    const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.35,
        emissive: 0x442200, // Warmer edge glow
        envMapIntensity: 1.0
    });

    const faceMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.7,
        roughness: 0.40,
        emissive: 0x221100, // Subtle face glow
        map: logoTexture,
        transparent: false,
        opacity: 0.4,
        envMapIntensity: 1.0
    });

    // CylinderGeometry materials array: [side, top, bottom]
    const coinMaterials = [edgeMaterial, faceMaterial, faceMaterial];

    for (let i = 0; i < 50; i++) {
        const mesh = new THREE.Mesh(coinGeometry, coinMaterials);
        mesh.position.x = (Math.random() - 0.5) * 120;
        mesh.position.y = (Math.random() - 0.5) * 120;
        mesh.position.z = (Math.random() - 0.5) * 60 - 20;

        // Random initial rotation so coins face different directions
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        // Random scale for variation
        const scale = Math.random() * 0.5 + 0.5;
        mesh.scale.set(scale, scale, scale);

        scene.add(mesh);

        shapes.push({
            mesh,
            rotSpeedX: (Math.random() - 0.5) * 0.05, // Faster spin for coins
            rotSpeedY: (Math.random() - 0.5) * 0.05,
            rotSpeedZ: (Math.random() - 0.5) * 0.02,
            floatSpeed: Math.random() * 0.02 + 0.01,
            yOffset: Math.random() * Math.PI * 2
        });
    }

    // Enhance Lighting for Metallic Reflection
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(10, 20, 20);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xffaa00, 2, 100);
    fillLight.position.set(-10, -10, 10);
    scene.add(fillLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;
        particlesMesh.position.y = Math.sin(elapsedTime * 0.3) * 1.5;

        shapes.forEach(shape => {
            shape.mesh.rotation.x += shape.rotSpeedX;
            shape.mesh.rotation.y += shape.rotSpeedY;
            shape.mesh.rotation.z += shape.rotSpeedZ;
            shape.mesh.position.y += Math.sin(elapsedTime * shape.floatSpeed + shape.yOffset) * 0.05;
        });

        // Parallax effect with mouse
        camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();
}

document.addEventListener("DOMContentLoaded", init3DBackground);
