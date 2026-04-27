document.addEventListener('DOMContentLoaded', () => {

    // 1. ANIMAÇÕES AO SCROLL (Intersection Observer)
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

    // 2. NAVBAR SCROLL EFFECT
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. CARROSSEL INFINITO & TOUCH
    const track = document.getElementById('carouselTrack');
    const cards = Array.from(track.children);

    // Clonagem para loop infinito suave
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // Scroll Automático
    let autoScrollSpeed = 0.5;
    let autoScrollPos = 0;

    function animate() {
        if (!isDragging) {
            autoScrollPos -= autoScrollSpeed;
            // Reinicia o loop se chegar na metade (fim do set original)
            if (Math.abs(autoScrollPos) >= track.scrollWidth / 2) {
                autoScrollPos = 0;
            }
            track.style.transform = `translateX(${autoScrollPos}px)`;
        }
        animationID = requestAnimationFrame(animate);
    }

    // Suporte a Touch
    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('touchmove', touchMove);

    function touchStart(event) {
        isDragging = true;
        startPos = event.touches[0].clientX;
        cancelAnimationFrame(animationID);
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = event.touches[0].clientX;
            const diff = currentPosition - startPos;
            autoScrollPos += diff;
            startPos = currentPosition;
            track.style.transform = `translateX(${autoScrollPos}px)`;
        }
    }

    function touchEnd() {
        isDragging = false;
        animate();
    }

    animate(); // Inicia o motor do carrossel

    // 4. PARALLAX SUTIL NO HERO
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
        const visual = document.querySelector('.nexus-core');
        if (visual) {
            visual.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
});