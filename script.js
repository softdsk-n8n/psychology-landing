/**
 * Script.js — Dark Premium Therapy Landing
 * 
 * Modules:
 *   - Scroll animations (IntersectionObserver)
 *   - Smooth scroll navigation
 *   - Parallax hero background
 *   - Mobile menu toggle
 *   - FAQ accordion
 *   - Navbar scroll effect
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initMobileMenu();
    initFaqAccordion();
    initCertCarousel();
    initLightbox();
});

/* ===================================================
   SMOOTH SCROLL
   =================================================== */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            event.preventDefault();

            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });

            // Close mobile menu if open
            const navLinks = document.getElementById('navLinks');
            const burger = document.getElementById('navBurger');
            if (navLinks && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                burger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}



/* ===================================================
   MOBILE MENU
   =================================================== */
function initMobileMenu() {
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');

    if (!burger || !navLinks) return;

    burger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        burger.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
}

/* ===================================================
   FAQ ACCORDION
   =================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const questionBtn = item.querySelector('.faq-item__question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach((otherItem) => {
                otherItem.classList.remove('active');
                const otherBtn = otherItem.querySelector('.faq-item__question');
                if (otherBtn) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}


/* ===================================================
   LIGHTBOX 
   =================================================== */
function initLightbox() {
    // Create lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox__close" aria-label="Закрити">&times;</button>
        <img class="lightbox__img" src="" alt="Zoomed image">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const closeBtn = lightbox.querySelector('.lightbox__close');

    // Attach click to elements
    const certImages = document.querySelectorAll('.carousel__slide img');
    certImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            if (lightboxImg.src.includes('cert')) {
                lightboxImg.style.background = '#fff';
                lightboxImg.style.padding = '10px';
            } else {
                lightboxImg.style.background = '';
                lightboxImg.style.padding = '';
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
}

/* ===================================================
   CERTIFICATES CAROUSEL
   =================================================== */
function initCertCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = track.querySelectorAll('.carousel__slide');
    const dots = dotsContainer.querySelectorAll('.carousel__dot');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoplayTimer = null;

    const goToSlide = (index) => {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('carousel__dot--active', i === currentIndex);
        });
    };

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoplay();
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index, 10);
            goToSlide(index);
            resetAutoplay();
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
            resetAutoplay();
        }
    }, { passive: true });

    // Autoplay
    const startAutoplay = () => {
        autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
    };

    const resetAutoplay = () => {
        clearInterval(autoplayTimer);
        startAutoplay();
    };

    startAutoplay();
}
