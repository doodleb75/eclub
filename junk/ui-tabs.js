// UI 탭 컴포넌트
// data-tab-trigger: 클릭 시 탭 변경 트리거
// data-tab-target: 표시할 컨텐츠 ID 또는 데이터 값
// data-tab-group: 탭 구분을 위한 그룹명
// data-tab-active-class: 활성화 시 사용할 클래스명 (기본값: active)
const uiTabs = (() => {
    const init = () => {
        // 모든 탭 트리거에 클릭 이벤트 등록
        const triggers = document.querySelectorAll('[data-tab-trigger]');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const isAnchor = trigger.tagName.toLowerCase() === 'a';
                if (isAnchor) e.preventDefault();

                const targetId = trigger.dataset.tabTarget;
                const groupName = trigger.dataset.tabGroup;
                const activeClass = trigger.dataset.tabActiveClass || 'active';

                if (targetId && groupName) {
                    activate(groupName, targetId, activeClass);
                }
            });
        });
    };

    // 지정된 그룹의 특정 탭 활성화
    const activate = (group, targetId, defaultActiveClass = 'active') => {
        // 그룹 내 트리거 버튼 활성화 상태 변경
        const groupTriggers = document.querySelectorAll(`[data-tab-group="${group}"][data-tab-trigger]`);
        groupTriggers.forEach(btn => {
            const activeClass = btn.dataset.tabActiveClass || defaultActiveClass;
            if (btn.dataset.tabTarget === targetId) {
                btn.classList.add(activeClass);
            } else {
                btn.classList.remove(activeClass);
            }
        });

        // 그룹 내 컨텐츠 영역 표시/숨김 변경
        const groupContents = document.querySelectorAll(`[data-tab-group="${group}"][data-tab-content]`);
        groupContents.forEach(content => {
            const activeClass = content.dataset.tabActiveClass || defaultActiveClass;
            const contentId = content.id || content.dataset.tabContent;
            if (contentId === targetId) {
                content.classList.add(activeClass);
            } else {
                content.classList.remove(activeClass);
            }
        });

        // 탭 변경 후 커스텀 이벤트 발생
        const event = new CustomEvent('tabChanged', {
            detail: { group, targetId }
        });
        document.dispatchEvent(event);
    };

    return { init, activate };
})();

// DOM 초기화 시점에 컴포넌트 시작
document.addEventListener('DOMContentLoaded', uiTabs.init);
