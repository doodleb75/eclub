import { PagingUtil } from './paging-util.js';

export const ProductMore = {
    init() {
        const containers = document.querySelectorAll('.product-list.is-more');
        if (!containers.length) return;

        containers.forEach(container => {
            container.classList.add('js-initialized'); // JS 초기화 표시 (CSS FOUC 해제)
            this.applyPaging(container);
        });

        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.product-more .btn-more');
            if (!btn) return;

            const moreWrap = btn.closest('.product-more');
            const container = moreWrap?.previousElementSibling;

            if (container && container.classList.contains('is-more')) {
                e.preventDefault();
                this.toggle(container, btn);
            }
        });
    },

    getVisibleItems(container) {
        return PagingUtil.getVisibleItems(container, '.product-item');
    },

    applyPaging(container) {
        const pageSize = parseInt(container.dataset.moreLimit || '10', 10);
        PagingUtil.applyPaging(container, '.product-item', pageSize, 'product-more');
    },

    toggle(container, btn) {
        const pageSize = parseInt(container.dataset.moreLimit || '10', 10);
        PagingUtil.toggle(container, btn, '.product-item', pageSize, '닫기');
    },

    // 활성 리스트 초기화 (탭 대응)
    resetActiveList(targetId) {
        const activeList = document.getElementById(targetId);
        if (!activeList || !activeList.classList.contains('is-more')) return;

        activeList.querySelectorAll('.product-item[data-hidden-by-more]').forEach(item => {
            item.style.display = '';
            delete item.dataset.hiddenByMore;
        });
        requestAnimationFrame(() => this.applyPaging(activeList));
    },

    // 정렬 초기화
    resetByCategory(container) {
        container.querySelectorAll('.product-item[data-hidden-by-more]').forEach(item => {
            delete item.dataset.hiddenByMore;
        });
        requestAnimationFrame(() => this.applyPaging(container));
    }
};
