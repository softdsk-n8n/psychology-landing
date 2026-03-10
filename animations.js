/**
 * animations.js — GSAP Premium Motion (safe fallback)
 * Uses ScrollTrigger.batch for better performance
 * All elements stay visible by default; animations are additive
 */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 0.8 });

    // Mark body so CSS knows GSAP is loaded (safe fallback)
    document.body.classList.add('gsap-ready');

    window.addEventListener('load', () => {
        initHeroAnimation();
        initScrollReveals();
        initStatCounters();
        initProcessTimeline();
        initBookingPulse();
        initNavbarScroll();
        initParallax();

        // Force recalculate so triggers already in viewport fire
        ScrollTrigger.refresh();

        // Safety fallback: if any element is still invisible after 3s, reveal it
        setTimeout(() => {
            document.querySelectorAll('.animate-on-scroll').forEach((el) => {
                if (getComputedStyle(el).opacity === '0') {
                    gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.4 });
                }
            });
        }, 3000);
    });

    /* ===================================================
       HERO ENTRANCE — timed sequence, no ScrollTrigger
       =================================================== */
    function initHeroAnimation() {
        // Set initial states
        gsap.set(['.hero__badge', '.hero__title', '.hero__text', '.hero__actions', '.hero__image', '.navbar'], {
            opacity: 0,
        });

        const tl = gsap.timeline({ delay: 0.15 });

        tl.to('.navbar', { opacity: 1, y: 0, duration: 0.4 });

        tl.to('.hero__badge', { opacity: 1, y: 0, duration: 0.4 }, '-=0.1');

        tl.fromTo('.hero__title',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out' },
            '-=0.2'
        );

        tl.to('.hero__text', { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');

        tl.to('.hero__actions', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');

        tl.fromTo('.hero__image',
            { opacity: 0, x: 50, scale: 0.96 },
            { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power4.out' },
            '-=0.7'
        );
    }

    /* ===================================================
       SCROLL-TRIGGERED REVEALS (batch approach)
       =================================================== */
    function initScrollReveals() {
        // Section headers — stagger children
        gsap.utils.toArray('.section__header').forEach((header) => {
            const children = header.querySelectorAll('.section__label, .section__title, .section__subtitle');
            if (!children.length) return;

            gsap.set(children, { opacity: 0, y: 30 });

            ScrollTrigger.create({
                trigger: header,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                    gsap.to(children, {
                        opacity: 1, y: 0,
                        stagger: 0.12, duration: 0.6,
                        ease: 'power4.out',
                    });
                },
            });
        });

        // Card grids — stagger reveal
        const cardGroups = [
            '.services__grid .service-card',
            '.advantages__grid .advantage-card',
            '.reviews__grid .review-card',
            '.pricing__grid .pricing-card',
            '.faq__list .faq-item',
        ];

        cardGroups.forEach((selector) => {
            const cards = gsap.utils.toArray(selector);
            if (!cards.length) return;

            gsap.set(cards, { opacity: 0, y: 35, scale: 0.97 });

            ScrollTrigger.create({
                trigger: cards[0].parentElement,
                start: 'top 82%',
                once: true,
                onEnter: () => {
                    gsap.to(cards, {
                        opacity: 1, y: 0, scale: 1,
                        stagger: 0.08, duration: 0.55,
                        ease: 'back.out(1.2)',
                    });
                },
            });
        });

        // About — slide from sides
        const aboutText = document.querySelector('.about__text');

        if (aboutText) {
            gsap.set(aboutText, { opacity: 0, x: -40 });
            ScrollTrigger.create({
                trigger: '.about__grid',
                start: 'top 82%',
                once: true,
                onEnter: () => {
                    gsap.to(aboutText, { opacity: 1, x: 0, duration: 0.8 });
                },
            });
        }

        // About stats — animate individual cards, not the container (keeps orbs visible)
        const statCards = gsap.utils.toArray('.about__stats .stat-card');
        if (statCards.length) {
            gsap.set(statCards, { opacity: 0, y: 25, scale: 0.95 });
            ScrollTrigger.create({
                trigger: '.about__grid',
                start: 'top 82%',
                once: true,
                onEnter: () => {
                    gsap.to(statCards, {
                        opacity: 1, y: 0, scale: 1,
                        stagger: 0.1, duration: 0.5,
                        ease: 'back.out(1.3)', delay: 0.2,
                    });
                },
            });
        }

        // Carousel
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            gsap.set(carousel, { opacity: 0, y: 35 });
            ScrollTrigger.create({
                trigger: '#certificates',
                start: 'top 82%',
                once: true,
                onEnter: () => {
                    gsap.to(carousel, { opacity: 1, y: 0, duration: 0.7 });
                },
            });
        }
    }

    /* ===================================================
       STAT COUNTERS
       =================================================== */
    function initStatCounters() {
        gsap.utils.toArray('.stat-card').forEach((card) => {
            const valueEl = card.querySelector('.stat-card__value');
            if (!valueEl) return;

            const text = valueEl.textContent.trim();
            const numMatch = text.match(/(\d+)/);
            if (!numMatch) return;

            const target = parseInt(numMatch[1], 10);
            const suffix = text.replace(numMatch[1], '');

            ScrollTrigger.create({
                trigger: card,
                start: 'top 88%',
                once: true,
                onEnter: () => {
                    const counter = { val: 0 };
                    gsap.to(counter, {
                        val: target,
                        duration: 1.2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            valueEl.textContent = Math.round(counter.val) + suffix;
                        },
                    });
                },
            });
        });
    }

    /* ===================================================
       PROCESS TIMELINE
       =================================================== */
    function initProcessTimeline() {
        const steps = gsap.utils.toArray('.process-step');
        if (!steps.length) return;

        const numberEls = steps.map((s) => s.querySelector('.process-step__number')).filter(Boolean);
        const titleEls = steps.map((s) => s.querySelector('.process-step__title')).filter(Boolean);
        const descEls = steps.map((s) => s.querySelector('.process-step__desc')).filter(Boolean);

        const allEls = [...numberEls, ...titleEls, ...descEls];
        gsap.set(allEls, { opacity: 0, y: 15 });
        gsap.set(numberEls, { scale: 0 });

        ScrollTrigger.create({
            trigger: '.process__timeline',
            start: 'top 80%',
            once: true,
            onEnter: () => {
                const tl = gsap.timeline();
                steps.forEach((step, i) => {
                    const num = step.querySelector('.process-step__number');
                    const title = step.querySelector('.process-step__title');
                    const desc = step.querySelector('.process-step__desc');

                    const offset = i === 0 ? '+=0' : '-=0.1';
                    if (num) tl.to(num, { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2.5)' }, offset);
                    if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.3 }, '-=0.1');
                    if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.25 }, '-=0.1');
                });
            },
        });
    }

    /* ===================================================
       BOOKING CTA GLOW
       =================================================== */
    function initBookingPulse() {
        const booking = document.querySelector('.booking');
        if (!booking) return;

        const title = booking.querySelector('.booking__title');
        const text = booking.querySelector('.booking__text');
        const btn = booking.querySelector('.btn');

        const els = [title, text, btn].filter(Boolean);
        gsap.set(els, { opacity: 0, y: 30 });

        ScrollTrigger.create({
            trigger: booking,
            start: 'top 78%',
            once: true,
            onEnter: () => {
                const tl = gsap.timeline();
                if (title) tl.to(title, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power4.out' });
                if (text) tl.to(text, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
                if (btn) {
                    tl.to(btn, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.2');
                    // Continuous glow
                    tl.to(btn, {
                        boxShadow: '0 0 35px rgba(139, 156, 255, 0.5)',
                        duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut',
                    }, '+=0.3');
                }
            },
        });
    }

    /* ===================================================
       NAVBAR SCROLL (GSAP)
       =================================================== */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        ScrollTrigger.create({
            trigger: document.body,
            start: '50px top',
            onEnter: () => navbar.classList.add('scrolled'),
            onLeaveBack: () => navbar.classList.remove('scrolled')
        });
    }

    /* ===================================================
       HERO PARALLAX (GSAP)
       =================================================== */
    function initParallax() {
        const heroBg = document.getElementById('heroBg');
        if (!heroBg) return;

        gsap.to(heroBg, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }
})();
