document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the very bottom
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Remove the class when out of view to enable fade out/re-trigger
                entry.target.classList.remove('active');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* ==========================================
       NAVBAR SCROLL EFFECT & ACTIVE STATE
       ========================================== */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-indicator');

    function updateNavIndicator(activeLink) {
        if (!activeLink || !navIndicator) return;

        navIndicator.style.opacity = '1';

        const navbar = document.querySelector('.navbar');
        const linkRect = activeLink.getBoundingClientRect();
        const navbarRect = navbar.getBoundingClientRect();

        const relativeLeft = linkRect.left - navbarRect.left + navbar.scrollLeft;
        const relativeTop = linkRect.top - navbarRect.top;

        navIndicator.style.left = `${relativeLeft}px`;
        navIndicator.style.top = `${relativeTop}px`;
        navIndicator.style.width = `${linkRect.width}px`;
        navIndicator.style.height = `${linkRect.height}px`;

        // Automatically scroll the navbar so the active capsule is visible (specifically for mobile)
        // We calculate the center of the link relative to the navbar and adjust scrollLeft smoothly
        if (window.innerWidth <= 900) {
            const scrollTarget = relativeLeft - (navbarRect.width / 2) + (linkRect.width / 2);
            navbar.scrollTo({
                left: scrollTarget,
                behavior: 'smooth'
            });
        }
    }

    // Set initial active state explicitly
    navLinks[0].classList.add('active');
    setTimeout(() => {
        updateNavIndicator(navLinks[0]);
    }, 100);

    window.addEventListener('scroll', () => {
        // Add Glassmorphism background to navbar on scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            // reset to top state
            if (window.innerWidth <= 900) {
                document.querySelector('.navbar').scrollTo({ left: 0, behavior: 'smooth' });
            }
        }

        // Highlight active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        let activeAssigned = false;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
                updateNavIndicator(link);
                activeAssigned = true;
            }
        });

        // Edge case: hitting top of page
        if (window.scrollY < 200 && !activeAssigned && navLinks.length > 0) {
            navLinks[0].classList.add('active');
            updateNavIndicator(navLinks[0]);
        }
    });

    // Also update on resize to keep the capsule aligned
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink) updateNavIndicator(activeLink);
    });

    /* ==========================================
       MOBILE MENU TOGGLE
       ========================================== */
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');

    if (menuToggle && mobileMenuOverlay) {
        menuToggle.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
            });
        }

        if (mobileMenuLinks) {
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuOverlay.classList.remove('active');
                });
            });
        }
    }

    /* ==========================================
       DYNAMIC GLITCH EFFECT RESET
       ========================================== */
    // Ensure glitch text doesn't get stuck
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        glitchText.addEventListener('mouseleave', () => {
            // Force reflow to "reset" the animation if it glitches visually in some browsers
            glitchText.style.animation = 'none';
            glitchText.offsetHeight; /* trigger reflow */
            glitchText.style.animation = null;
        });
    }

    /* ==========================================
       NAVBAR DRAG TO SCROLL (MOBILE)
       ========================================== */
    const mobileNavbar = document.querySelector('.navbar');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (mobileNavbar) {
        // Mouse dragging
        mobileNavbar.addEventListener('mousedown', (e) => {
            isDown = true;
            mobileNavbar.style.cursor = 'grabbing';
            startX = e.pageX - mobileNavbar.offsetLeft;
            scrollLeft = mobileNavbar.scrollLeft;
        });
        mobileNavbar.addEventListener('mouseleave', () => {
            isDown = false;
            mobileNavbar.style.cursor = 'grab';
        });
        mobileNavbar.addEventListener('mouseup', () => {
            isDown = false;
            mobileNavbar.style.cursor = 'grab';
        });
        mobileNavbar.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - mobileNavbar.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            mobileNavbar.scrollLeft = scrollLeft - walk;
        });

        // Touch dragging (usually handled by native overflow-x scroll, but explicitly enforcing)
        mobileNavbar.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - mobileNavbar.offsetLeft;
            scrollLeft = mobileNavbar.scrollLeft;
        });
        mobileNavbar.addEventListener('touchend', () => {
            isDown = false;
        });
        mobileNavbar.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - mobileNavbar.offsetLeft;
            const walk = (x - startX) * 2;
            mobileNavbar.scrollLeft = scrollLeft - walk;
        });
    }

});
