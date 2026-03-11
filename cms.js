document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('content/content.json');
        if (!response.ok) throw new Error('Failed to load content.json');
        const data = await response.json();

        // HERO
        if (data.hero) {
            const heroBadge = document.querySelector('.hero__badge');
            if (heroBadge) heroBadge.innerHTML = data.hero.badge;
            const heroTitle = document.querySelector('.hero__title');
            if (heroTitle) heroTitle.innerHTML = data.hero.title;
            const heroText = document.querySelector('.hero__text');
            if (heroText) heroText.innerHTML = data.hero.text;
            const ctaPrimary = document.querySelector('#heroCtaPrimary');
            if (ctaPrimary) ctaPrimary.innerHTML = data.hero.ctaPrimary;
            const ctaSecondary = document.querySelector('#heroCtaSecondary');
            if (ctaSecondary) ctaSecondary.innerHTML = data.hero.ctaSecondary;
        }

        // ABOUT
        if (data.about) {
            const aboutSect = document.querySelector('#about');
            if (aboutSect) {
                aboutSect.querySelector('.section__label').innerHTML = data.about.label;
                aboutSect.querySelector('.section__title').innerHTML = data.about.title;

                const aboutTextDiv = aboutSect.querySelector('.about__text');
                if (aboutTextDiv && data.about.paragraphs) {
                    aboutTextDiv.innerHTML = data.about.paragraphs.map(p => `<p>${p}</p>`).join('');
                }

                const statCards = aboutSect.querySelectorAll('.stat-card');
                data.about.stats.forEach((stat, i) => {
                    if (statCards[i]) {
                        statCards[i].querySelector('.stat-card__value').innerHTML = stat.value;
                        statCards[i].querySelector('.stat-card__label').innerHTML = stat.label;
                    }
                });
            }
        }

        // SERVICES
        if (data.services) {
            const srvSect = document.querySelector('#services');
            if (srvSect) {
                srvSect.querySelector('.section__label').innerHTML = data.services.label;
                srvSect.querySelector('.section__title').innerHTML = data.services.title;
                srvSect.querySelector('.section__subtitle').innerHTML = data.services.subtitle;

                const srvCards = srvSect.querySelectorAll('.service-card');
                data.services.items.forEach((item, i) => {
                    if (srvCards[i]) {
                        srvCards[i].querySelector('.service-card__title').innerHTML = item.title;
                        srvCards[i].querySelector('.service-card__desc').innerHTML = item.desc;
                    }
                });
            }
        }

        // PROCESS
        if (data.process) {
            const procSect = document.querySelector('#process');
            if (procSect) {
                procSect.querySelector('.section__label').innerHTML = data.process.label;
                procSect.querySelector('.section__title').innerHTML = data.process.title;
                procSect.querySelector('.section__subtitle').innerHTML = data.process.subtitle;

                const steps = procSect.querySelectorAll('.process-step');
                data.process.steps.forEach((step, i) => {
                    if (steps[i]) {
                        steps[i].querySelector('.process-step__number').innerHTML = step.number;
                        steps[i].querySelector('.process-step__title').innerHTML = step.title;
                        steps[i].querySelector('.process-step__desc').innerHTML = step.desc;
                    }
                });
            }
        }

        // PRICING
        if (data.pricing) {
            const priceSect = document.querySelector('#pricing');
            if (priceSect) {
                priceSect.querySelector('.section__label').innerHTML = data.pricing.label;
                priceSect.querySelector('.section__title').innerHTML = data.pricing.title;

                const cards = priceSect.querySelectorAll('.pricing-card');
                data.pricing.cards.forEach((card, i) => {
                    if (cards[i]) {
                        cards[i].querySelector('.pricing-card__title').innerHTML = card.title;
                        cards[i].querySelector('.pricing-card__desc').innerHTML = card.desc;
                        cards[i].querySelector('.pricing-card__price').innerHTML = card.price;
                        cards[i].querySelector('.pricing-card__unit').innerHTML = card.unit;

                        const ul = cards[i].querySelector('.pricing-card__features');
                        if (ul) {
                            ul.innerHTML = card.features.map(f => `<li>${f}</li>`).join('');
                        }

                        const btn = cards[i].querySelector('.btn');
                        if (btn) {
                            btn.innerHTML = card.cta;
                            btn.href = card.link;
                        }
                    }
                });
            }
        }

        // ADVANTAGES
        if (data.advantages) {
            const advSect = document.querySelector('#advantages');
            if (advSect) {
                advSect.querySelector('.section__label').innerHTML = data.advantages.label;
                advSect.querySelector('.section__title').innerHTML = data.advantages.title;

                const cards = advSect.querySelectorAll('.advantage-card');
                data.advantages.items.forEach((item, i) => {
                    if (cards[i]) {
                        cards[i].querySelector('.advantage-card__title').innerHTML = item.title;
                        cards[i].querySelector('.advantage-card__desc').innerHTML = item.desc;
                    }
                });
            }
        }

        // FAQ
        if (data.faq) {
            const faqSect = document.querySelector('#faq');
            if (faqSect) {
                faqSect.querySelector('.section__label').innerHTML = data.faq.label;
                faqSect.querySelector('.section__title').innerHTML = data.faq.title;

                const items = faqSect.querySelectorAll('.faq-item');
                data.faq.items.forEach((item, i) => {
                    if (items[i]) {
                        // Need to carefully replace only text, preserving the + icon span
                        const btn = items[i].querySelector('.faq-item__question');
                        if (btn) {
                            const iconHTML = '<span class="faq-item__icon">+</span>';
                            btn.innerHTML = item.question + iconHTML;
                        }
                        const ans = items[i].querySelector('.faq-item__answer-inner');
                        if (ans) {
                            ans.innerHTML = item.answer;
                        }
                    }
                });
            }
        }

        // BOOKING
        if (data.booking) {
            const bookingSect = document.querySelector('#booking');
            if (bookingSect) {
                bookingSect.querySelector('.booking__title').innerHTML = data.booking.title;
                bookingSect.querySelector('.booking__text').innerHTML = data.booking.text;
                const cta = bookingSect.querySelector('#bookingCta');
                if (cta) cta.innerHTML = data.booking.cta;
            }
        }

        // FOOTER
        if (data.footer) {
            const footerSect = document.querySelector('#contacts');
            if (footerSect) {
                const copy = footerSect.querySelector('.footer__copy');
                if (copy) copy.innerHTML = data.footer.copy;

                const tg = footerSect.querySelector('#footerTelegram');
                if (tg) tg.href = data.footer.telegram;

                const em = footerSect.querySelector('#footerEmail');
                if (em) em.href = "mailto:" + data.footer.email;
            }
        }

    } catch (error) {
        console.error('Error loading CMS content:', error);
    }
});
