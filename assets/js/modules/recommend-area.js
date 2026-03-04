import { Slider } from './slider.js';

export const RecommendArea = {
    init() {
        const area = document.querySelector('.recommend-area');
        const list = area?.querySelector('.product-list');
        if (!list) return;

        const prevBtn = area.querySelector('.btn-slide-prev');
        const nextBtn = area.querySelector('.btn-slide-next');
        const itemsPerPage = 5;

        const updateBtns = Slider.bindNavButtons(list, prevBtn, nextBtn);

        // 요소가 화면에 나타날 때 (display: block 등) 감지
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && updateBtns) {
                    updateBtns();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(area);

        if (prevBtn) prevBtn.onclick = () => Slider.scroll(list, 'left', itemsPerPage);
        if (nextBtn) nextBtn.onclick = () => Slider.scroll(list, 'right', itemsPerPage);

        window.addEventListener('resize', updateBtns);
    }
};
