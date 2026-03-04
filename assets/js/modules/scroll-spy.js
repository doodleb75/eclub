import { getZoomScale } from './browser-zoom.js';

export const ScrollSpy = {
    init() {
        const tabWrap = document.querySelector('.cart-tab-wrap');
        if (!tabWrap) return;
        const methodLinks = document.querySelectorAll('.cart-tabs .tab-item:not(.recent) .tab-link');
        const sections = [];

        const getHeaderHeight = () => {
            const stickyWrap = tabWrap.closest('.cart-sticky-wrap') || tabWrap;
            const computedStyle = window.getComputedStyle(stickyWrap);
            const topVal = parseFloat(computedStyle.top);
            const stickyTop = isNaN(topVal) ? 0 : topVal;
            return stickyTop + stickyWrap.offsetHeight;
        };

        methodLinks.forEach(link => {
            const id = link.getAttribute('href');
            if (id && id.startsWith('#') && id !== '#') {
                const section = document.querySelector(id);
                if (section) sections.push({ id, el: section, link, parent: link.closest('.tab-item') });
            } else if (id === '#wrap') {
                sections.push({ id: '#wrap', el: document.body, link, parent: link.closest('.tab-item') });
            }
        });

        let isAutoScrolling = false;
        let scrollTimeout = null;
        let isThrottled = false;

        methodLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                methodLinks.forEach(l => l.closest('.tab-item').classList.remove('active'));
                link.closest('.tab-item').classList.add('active');
                isAutoScrolling = true;
                if (scrollTimeout) clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => isAutoScrolling = false, 1200);
                if (targetId === '#wrap' || targetId === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        const scale = getZoomScale();
                        const offset = getHeaderHeight();
                        const top = targetEl.getBoundingClientRect().top + window.scrollY - (offset * scale);
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                }
            });
        });

        window.addEventListener('scroll', () => {
            if (isAutoScrolling || isThrottled) return;
            isThrottled = true;
            requestAnimationFrame(() => {
                const scale = getZoomScale();
                const offset = getHeaderHeight();
                const scrollPos = window.scrollY + (offset * scale) + 10;
                let currentSection = null;
                for (const section of sections) {
                    const offsetTop = section.el === document.body ? 0 : (section.el.getBoundingClientRect().top + window.scrollY);
                    if (scrollPos >= offsetTop) currentSection = section;
                }
                if (currentSection) {
                    methodLinks.forEach(l => l.closest('.tab-item').classList.remove('active'));
                    currentSection.parent.classList.add('active');
                }
                isThrottled = false;
            });
        });
    }
};
