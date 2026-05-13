document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────
    // UTILITÁRIOS
    // ─────────────────────────────────────────────

    const isTouchDevice = () =>
        window.matchMedia('(pointer: coarse)').matches;

    const prefersReducedMotion = () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    // ─────────────────────────────────────────────
    // 1. SCROLL ANIMATION (Intersection Observer)
    // ─────────────────────────────────────────────
    const aoElements = document.querySelectorAll('[data-aos]');

    if (aoElements.length) {
        const aoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    aoObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        aoElements.forEach(el => aoObserver.observe(el));
    }


    // ─────────────────────────────────────────────
    // 2. NAVBAR — scroll hide/show + scrolled class
    // ─────────────────────────────────────────────
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        let lastScroll = 0;
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScroll = window.scrollY;

                    navbar.classList.toggle('scrolled', currentScroll > 50);

                    if (currentScroll > lastScroll && currentScroll > 100) {
                        navbar.style.transform = 'translate(-50%, -120%)';
                    } else {
                        navbar.style.transform = 'translate(-50%, 0)';
                    }

                    lastScroll = Math.max(currentScroll, 0);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }


    // ─────────────────────────────────────────────
    // 3. CARROSSEL — auto-scroll + drag/swipe
    // ─────────────────────────────────────────────
    const track = document.getElementById('carouselTrack');

    if (track && !track.dataset.initiated) {
        track.dataset.initiated = 'true';

        // Duplica os cards para loop infinito
        [...track.children].forEach(card =>
            track.appendChild(card.cloneNode(true))
        );

        let pos = 0;
        let dragging = false;
        let startX = 0;
        let velX = 0;
        let rafId = null;
        const SPEED = 0.5;

        let paused = false;

        track.addEventListener('mouseenter', () => { paused = true; });
        track.addEventListener('mouseleave', () => { paused = false; });

        // Mouse drag
        track.addEventListener('mousedown', (e) => {
            dragging = true;
            startX = e.clientX;
            velX = 0;
        });

        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const diff = e.clientX - startX;
            velX = diff * 0.8;
            pos += diff;
            startX = e.clientX;
            track.style.transform = `translateX(${pos}px)`;
        });

        window.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
        });

        // Touch swipe
        track.addEventListener('touchstart', (e) => {
            dragging = true;
            startX = e.touches[0].clientX;
            velX = 0;
            paused = true;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            const diff = e.touches[0].clientX - startX;
            velX = diff * 0.8;
            pos += diff;
            startX = e.touches[0].clientX;
            track.style.transform = `translateX(${pos}px)`;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            dragging = false;
            paused = false;
        });

        // Loop de animação
        const animate = () => {
            if (!dragging && !paused) {
                pos -= SPEED;

                if (Math.abs(velX) > 0.1) {
                    pos += velX;
                    velX *= 0.92;
                } else {
                    velX = 0;
                }

                const limit = track.scrollWidth / 2;
                if (Math.abs(pos) >= limit) pos = 0;

                track.style.transform = `translateX(${pos}px)`;
            }

            rafId = requestAnimationFrame(animate);
        };

        // Pausa quando fora da tela
        const visibilityObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                rafId = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(rafId);
            }
        });

        visibilityObserver.observe(track);
    }


    // ─────────────────────────────────────────────
    // 4. PARALLAX — desktop / sem reduced-motion
    // ─────────────────────────────────────────────
    const visual = document.querySelector('.nexus-core');

    if (visual && !isTouchDevice() && !prefersReducedMotion()) {
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
        }, { passive: true });

        const smoothParallax = () => {
            targetX += (mouseX - targetX) * 0.08;
            targetY += (mouseY - targetY) * 0.08;
            visual.style.transform = `translate(${targetX}px, ${targetY}px)`;
            requestAnimationFrame(smoothParallax);
        };

        smoothParallax();
    }


    // ─────────────────────────────────────────────
    // 5. MOBILE MENU
    // ─────────────────────────────────────────────
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
        const closeMenu = () => {
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir menu');
        };

        const openMenu = () => {
            menu.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Fechar menu');
        };

        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.contains('active');
            isOpen ? closeMenu() : openMenu();
        });

        menu.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', closeMenu)
        );

        document.addEventListener('click', (e) => {
            if (navbar && !navbar.contains(e.target)) closeMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }


    // ─────────────────────────────────────────────
    // 6. THREE.JS — partículas com resize responsivo
    // ─────────────────────────────────────────────
    const canvas = document.getElementById('heroCanvas');

    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
        camera.position.z = 4;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const resize = () => {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight || canvas.clientWidth;

            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };

        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const light1 = new THREE.PointLight(0xffffff, 1.5);
        light1.position.set(5, 5, 5);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x888888, 0.8);
        light2.position.set(-5, -5, -5);
        scene.add(light2);

        const COUNT = isTouchDevice() ? 3000 : 6000;
        const positions = new Float32Array(COUNT * 3);

        for (let i = 0; i < COUNT * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 3;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: 0.012,
            color: 0xcccccc,
            transparent: true,
            opacity: 0.9,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        let animating = true;

        const canvasObserver = new IntersectionObserver(([entry]) => {
            animating = entry.isIntersecting;
        });
        canvasObserver.observe(canvas);

        const animate = () => {
            requestAnimationFrame(animate);
            if (!animating || prefersReducedMotion()) return;

            particles.rotation.y += 0.0012;
            particles.rotation.x += 0.0008;

            renderer.render(scene, camera);
        };

        animate();
    }


    // ─────────────────────────────────────────────
    // 7. BACK TO TOP
    // ─────────────────────────────────────────────
    const backToTop = document.querySelector('.back-to-top');

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});


// ═══════════════════════════════════════════════════════
// MOBILE PREMIUM ENHANCEMENTS
// ═══════════════════════════════════════════════════════

(function () {
    'use strict';

    /* ─────────────────────────────
       1. SCROLL PROGRESS BAR
    ───────────────────────────── */
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.prepend(progressBar);

    /* ─────────────────────────────
       2. SECTION NAV DOTS
    ───────────────────────────── */
    const sectionIds = ['home', 'servicos', 'portfolio', 'sobre'];
    const navDotsWrapper = document.createElement('div');
    navDotsWrapper.className = 'section-nav-dots';
    navDotsWrapper.setAttribute('aria-hidden', 'true');

    sectionIds.forEach((id, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', 'Ir para seção ' + (i + 1));
        dot.addEventListener('click', () => {
            const target = document.getElementById(id);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
        navDotsWrapper.appendChild(dot);
    });

    document.body.appendChild(navDotsWrapper);
    const allDots = navDotsWrapper.querySelectorAll('.dot');

    /* ─────────────────────────────
       3. CENA 3D CSS (somente mobile)
    ───────────────────────────── */
    function isMobile() {
        return window.innerWidth <= 768;
    }

    function build3DScene() {
        if (!isMobile()) return;

        const original3D = document.querySelector('.hero-3d');
        if (!original3D || document.querySelector('.hero-3d-css')) return;

        const scene = document.createElement('div');
        scene.className = 'hero-3d-css';
        scene.setAttribute('aria-hidden', 'true');

        scene.innerHTML = `
      <div class="scene-stage-css">
        <!-- CÂMERA -->
        <div class="obj-camera">
          <div class="obj-glow-cam"></div>
          <div class="cam-front">
            <div class="cam-lens-ring"></div>
            <div class="cam-vf"></div>
          </div>
          <div class="cam-top-face"></div>
          <div class="cam-right-face">
            <div class="cam-btn-small"></div>
            <div class="cam-btn-small"></div>
          </div>
        </div>

        <!-- NOTEBOOK -->
        <div class="obj-notebook">
          <div class="obj-glow-nb"></div>
          <div class="nb-lid">
            <div class="nb-screen-inner">
              <div class="nb-line"></div>
              <div class="nb-line"></div>
              <div class="nb-line"></div>
              <div class="nb-line"></div>
              <div class="nb-line"></div>
              <div class="nb-line" style="width:42%"></div>
            </div>
          </div>
          <div class="nb-keyboard"></div>
          <div class="nb-side-face"></div>
        </div>

        <!-- CELULAR -->
        <div class="obj-phone">
          <div class="obj-glow-ph"></div>
          <div class="ph-chassis">
            <div class="ph-pill"></div>
            <div class="ph-display">
              <div class="ph-app"></div><div class="ph-app"></div><div class="ph-app"></div>
              <div class="ph-app"></div><div class="ph-app"></div><div class="ph-app"></div>
            </div>
            <div class="ph-home-bar"></div>
          </div>
          <div class="ph-edge"></div>
          <div class="ph-vol"></div>
        </div>
      </div>
    `;

        original3D.parentNode.insertBefore(scene, original3D);
        original3D.style.display = 'none';

        /* Giroscópio */
        const stage = scene.querySelector('.scene-stage-css');
        if (stage && window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                if (e.beta === null) return;
                const rx = Math.max(-10, Math.min(10, (e.beta - 45) * 0.4));
                const ry = Math.max(-10, Math.min(10, e.gamma * 0.4));
                stage.style.animation = 'none';
                stage.style.transform = `rotateX(${8 + rx}deg) rotateY(${ry}deg)`;
            }, { passive: true });
        }
    }

    /* ─────────────────────────────
       4. FADE-UP on SCROLL (mobile)
    ───────────────────────────── */
    function initFadeUp() {
        const targets = document.querySelectorAll(
            '.hero-content, .service-card, .cta-card, .team-card, ' +
            '.about-content, .insta-interface-wrapper, .cta-box'
        );
        targets.forEach((el, i) => {
            el.classList.add('mob-fade-up');
            el.style.transitionDelay = (i % 4 * 0.1) + 's';
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        targets.forEach(el => io.observe(el));
    }

    /* ─────────────────────────────
       5. MAIN SCROLL HANDLER
    ───────────────────────────── */
    let ticking = false;

    function onScroll() {
        if (ticking) return;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

            // Progress bar
            progressBar.style.width = ((scrollY / maxScroll) * 100).toFixed(1) + '%';

            // Active dot
            const midY = scrollY + window.innerHeight * 0.5;
            sectionIds.forEach((id, i) => {
                const el = document.getElementById(id);
                if (!el) return;
                const top = el.offsetTop;
                const bot = top + el.offsetHeight;
                if (allDots[i]) {
                    allDots[i].classList.toggle('active', midY >= top && midY < bot);
                }
            });

            ticking = false;
        });
        ticking = true;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ─────────────────────────────
       INIT
    ───────────────────────────── */
    build3DScene();
    initFadeUp();

    let lastMobile = isMobile();
    window.addEventListener('resize', () => {
        const nowMobile = isMobile();
        if (nowMobile !== lastMobile) {
            lastMobile = nowMobile;
            if (nowMobile) {
                build3DScene();
            } else {
                const css3D = document.querySelector('.hero-3d-css');
                const canvas3D = document.querySelector('.hero-3d');
                if (css3D) css3D.remove();
                if (canvas3D) canvas3D.style.display = '';
            }
        }
    }, { passive: true });

})();
