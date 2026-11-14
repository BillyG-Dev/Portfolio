
/* =========================================
   BILL YEGON PORTFOLIO
   JavaScript Interactions
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =====================================
       MOBILE NAVIGATION
    ===================================== */

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navItems = document.querySelectorAll(".nav-link");

    function closeMenu() {
        navLinks.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");

        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        menuToggle.innerHTML = isOpen
            ? '<i class="fas fa-xmark"></i>'
            : '<i class="fas fa-bars"></i>';

    });

    navItems.forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {

        if (
            !navLinks.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }

    });

    /* =====================================
       PROFILE IMAGE FALLBACK
    ===================================== */

    const profileImage = document.getElementById("profile-image");
    const profileFallback = document.getElementById("profile-fallback");

    function showProfileFallback() {
        profileImage.style.display = "none";
        profileFallback.style.display = "grid";
    }

    profileImage.addEventListener("error", showProfileFallback);

    if (profileImage.complete && profileImage.naturalWidth === 0) {
        showProfileFallback();
    }

    /* =====================================
       SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reducedMotion) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }

    /* =====================================
       ACTIVE NAVIGATION ON SCROLL
    ===================================== */

    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        navItems.forEach(link => {

                            link.classList.remove("active");

                            if (
                                link.getAttribute("href") ===
                                `#${entry.target.id}`
                            ) {
                                link.classList.add("active");
                            }

                        });

                    }

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }

    /* =====================================
       PARTICLE SYSTEM
    ===================================== */

    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");

    let particles = [];
    let animationFrame;
    let canvasWidth = 0;
    let canvasHeight = 0;

    const particleColors = [
        "0, 217, 255",
        "113, 60, 255",
        "240, 77, 255",
        "183, 199, 255"
    ];

    function resizeCanvas() {

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;

        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;

        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        createParticles();

    }

    function createParticles() {

        const particleCount = Math.min(
            75,
            Math.max(20, Math.floor(canvasWidth / 18))
        );

        particles = [];

        for (let i = 0; i < particleCount; i++) {

            particles.push({

                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,

                radius: Math.random() * 1.6 + 0.5,

                speedX: (Math.random() - 0.5) * 0.35,
                speedY: (Math.random() - 0.5) * 0.35,

                opacity: Math.random() * 0.55 + 0.15,

                color: particleColors[
                    Math.floor(Math.random() * particleColors.length)
                ]

            });

        }

    }

    function drawParticles() {

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        particles.forEach(particle => {

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0) particle.x = canvasWidth;
            if (particle.x > canvasWidth) particle.x = 0;

            if (particle.y < 0) particle.y = canvasHeight;
            if (particle.y > canvasHeight) particle.y = 0;

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${particle.color}, ${particle.opacity})`;

            ctx.fill();

        });

        /* CONNECT PARTICLES */

        particles.forEach((particle, i) => {

            for (let j = i + 1; j < particles.length; j++) {

                const other = particles[j];

                const dx = particle.x - other.x;
                const dy = particle.y - other.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 125) {

                    ctx.beginPath();

                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);

                    ctx.strokeStyle =
                        `rgba(0, 217, 255, ${0.11 * (1 - distance / 125)})`;

                    ctx.lineWidth = 0.6;

                    ctx.stroke();

                }

            }

        });

    }

    function animateParticles() {

        if (document.hidden || reducedMotion) {
            return;
        }

        drawParticles();

        animationFrame = requestAnimationFrame(animateParticles);

    }

    function startParticles() {

        if (reducedMotion || document.hidden) {
            return;
        }

        cancelAnimationFrame(animationFrame);

        animateParticles();

    }

    function stopParticles() {
        cancelAnimationFrame(animationFrame);
    }

    if (!reducedMotion) {

        resizeCanvas();
        startParticles();

        let resizeTimer;

        window.addEventListener("resize", () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {
                resizeCanvas();
            }, 150);

        });

        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {
                stopParticles();
            } else {
                startParticles();
            }

        });

    }

    /* =====================================
       PROJECT CARD TILT
    ===================================== */

    const projectCards = document.querySelectorAll(".project-card");

    const supportsFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (supportsFinePointer && !reducedMotion) {

        projectCards.forEach(card => {

            card.addEventListener("pointermove", event => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (centerY - y) / 35;
                const rotateY = (x - centerX) / 35;

                card.style.transform =
                    `translateY(-7px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });

        });

    }

    /* =====================================
       FOOTER YEAR
    ===================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

});
