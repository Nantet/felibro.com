document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. ANIMAÇÕES AO SCROLL =================
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

    // ================= 2. NAVBAR SCROLL PRO =================
    const navbar = document.getElementById('navbar');

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // efeito glass + sombra
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // esconder ao descer
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = "translate(-50%, -120%)";
        } else {
            // mostrar ao subir
            navbar.style.transform = "translate(-50%, 0)";
        }

        lastScroll = currentScroll;
    });

    // ================= 3. CARROSSEL =================
    const track = document.getElementById('carouselTrack');
    const cards = Array.from(track.children);

    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let isDragging = false;
    let startPos = 0;
    let animationID = 0;

    let autoScrollSpeed = 0.5;
    let autoScrollPos = 0;

    function animate() {
        if (!isDragging) {
            autoScrollPos -= autoScrollSpeed;

            if (Math.abs(autoScrollPos) >= track.scrollWidth / 2) {
                autoScrollPos = 0;
            }

            track.style.transform = `translateX(${autoScrollPos}px)`;
        }

        animationID = requestAnimationFrame(animate);
    }

    track.addEventListener('touchstart', (event) => {
        isDragging = true;
        startPos = event.touches[0].clientX;
        cancelAnimationFrame(animationID);
    });

    track.addEventListener('touchmove', (event) => {
        if (isDragging) {
            const currentPosition = event.touches[0].clientX;
            const diff = currentPosition - startPos;
            autoScrollPos += diff;
            startPos = currentPosition;

            track.style.transform = `translateX(${autoScrollPos}px)`;
        }
    });

    track.addEventListener('touchend', () => {
        isDragging = false;
        animate();
    });

    animate();

    // ================= 4. PARALLAX =================
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;

        const visual = document.querySelector('.nexus-core');

        if (visual) {
            visual.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });

    // ================= 5. MENU MOBILE =================
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {

        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    }

});
