import { PagingUtil } from './paging-util.js';

export const FilterMore = {
    init() {
        const containers = document.querySelectorAll('.filter-list.is-more');
        if (!containers.length) return;

        containers.forEach(container => {
            this.applyPaging(container);
        });

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-more .btn-more');
            if (!btn) return;

            const moreWrap = btn.closest('.filter-more');
            const container = moreWrap?.previousElementSibling;

            if (container && container.classList.contains('is-more')) {
                e.preventDefault();
                this.toggle(container, btn);
            }
        });
    },

    getVisibleItems(container) {
        return PagingUtil.getVisibleItems(container, 'li');
    },

    applyPaging(container) {
        const pageSize = parseInt(container.dataset.moreLimit || '5', 10);
        PagingUtil.applyPaging(container, 'li', pageSize, 'filter-more');
    },

    toggle(container, btn) {
        const pageSize = parseInt(container.dataset.moreLimit || '5', 10);
        PagingUtil.toggle(container, btn, 'li', pageSize, '닫기');
    }
};
