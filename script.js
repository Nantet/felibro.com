document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. SCROLL ANIMATION =================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

    // ================= 2. NAVBAR =================
    const navbar = document.querySelector('.navbar'); // CORRIGIDO
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (!navbar) return;

        navbar.classList.toggle('scrolled', currentScroll > 50);

        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = "translate(-50%, -120%)";
        } else {
            navbar.style.transform = "translate(-50%, 0)";
        }

        lastScroll = currentScroll;
    });

    // ================= 3. CARROSSEL =================
    const track = document.getElementById('carouselTrack');

    if (track && !track.dataset.initiated) {
        track.dataset.initiated = "true";

        const cards = [...track.children];
        cards.forEach(card => track.appendChild(card.cloneNode(true)));

        let pos = 0;
        let dragging = false;
        let startX = 0;

        const animate = () => {
            if (!dragging) {
                pos -= 0.4;
                const limit = track.scrollWidth / 2;
                if (Math.abs(pos) >= limit) pos = 0;

                track.style.transform = `translateX(${pos}px)`;
            }
            requestAnimationFrame(animate);
        };

        track.addEventListener('touchstart', (e) => {
            dragging = true;
            startX = e.touches[0].clientX;
        });

        track.addEventListener('touchmove', (e) => {
            const diff = e.touches[0].clientX - startX;
            pos += diff * 0.8;
            startX = e.touches[0].clientX;
            track.style.transform = `translateX(${pos}px)`;
        });

        track.addEventListener('touchend', () => dragging = false);

        animate();
    }

    // ================= 4. PARALLAX =================
    const visual = document.querySelector('.nexus-core');

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
    });

    function smoothParallax() {
        targetX += (mouseX - targetX) * 0.08;
        targetY += (mouseY - targetY) * 0.08;

        if (visual) {
            visual.style.transform = `translate(${targetX}px, ${targetY}px)`;
        }

        requestAnimationFrame(smoothParallax);
    }

    smoothParallax();

    // ================= 5. MOBILE MENU =================
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');

    toggle?.addEventListener('click', () => {
        menu?.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menu?.classList.remove('active');
        });
    });

    // ================= 6. THREE.JS (CORRIGIDO) =================
    const canvas = document.getElementById("heroCanvas"); // CORRIGIDO

    if (canvas && typeof THREE !== "undefined") {

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            55,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );

        camera.position.z = 4;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });

        function resize() {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        resize();
        window.addEventListener('resize', resize);

        // LIGHTS
        const light = new THREE.PointLight(0xffffff, 1.5);
        light.position.set(5, 5, 5);
        scene.add(light);

        const light2 = new THREE.PointLight(0x888888, 0.8);
        light2.position.set(-5, -5, -5);
        scene.add(light2);

        // PARTICLES
        const geometry = new THREE.BufferGeometry();
        const count = 6000;

        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 3;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.012,
            color: 0xcccccc,
            transparent: true,
            opacity: 0.9
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // ANIMAÇÃO
        function animate() {
            requestAnimationFrame(animate);

            particles.rotation.y += 0.0012;
            particles.rotation.x += 0.0008;

            renderer.render(scene, camera);
        }

        animate();
    }

});
