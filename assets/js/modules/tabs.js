export const Tabs = {
    // 탭 초기화
    init() {
        document.removeEventListener('click', this.handleTabClick);
        this.handleTabClick = (e) => {
            const trigger = e.target.closest('[data-tab-trigger]');
            if (!trigger) return;

            if (trigger.tagName.toLowerCase() === 'a') e.preventDefault();
            const targetId = trigger.dataset.tabTarget;
            const groupName = trigger.dataset.tabGroup;
            const activeClass = trigger.dataset.tabActiveClass || 'active';

            if (targetId && groupName) this.activate(groupName, targetId, activeClass);
        };
        document.addEventListener('click', this.handleTabClick);
    },
    // 탭 활성화
    activate(group, targetId, defaultActiveClass = 'active') {
        const groupTriggers = document.querySelectorAll(`[data-tab-group="${group}"][data-tab-trigger]`);
        groupTriggers.forEach(btn => {
            const activeClass = btn.dataset.tabActiveClass || defaultActiveClass;
            btn.classList.toggle(activeClass, btn.dataset.tabTarget === targetId);
        });
        const groupContents = document.querySelectorAll(`[data-tab-group="${group}"][data-tab-content]`);
        groupContents.forEach(content => {
            const activeClass = content.dataset.tabActiveClass || defaultActiveClass;
            const contentId = content.id || content.dataset.tabContent;
            content.classList.toggle(activeClass, contentId === targetId);
        });
        document.dispatchEvent(new CustomEvent('tabChanged', { detail: { group, targetId } }));

        if (group === 'best-period') {
            const activeAllBtn = document.querySelector('.category-tabs button[data-tab="all"]');
            if (activeAllBtn) {
                activeAllBtn.click();
            }
            // 더보기 높이 갱신 (탭 전환 대응)
            const Eclub = window.Eclub;
            if(Eclub && Eclub.ProductMore) {
                Eclub.ProductMore.resetActiveList(targetId);
            }
        }
    }
};
