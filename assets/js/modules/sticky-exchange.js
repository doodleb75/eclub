export const StickyExchange = {
    init() {
        const filterArea = document.querySelector('.sticky-filter-area');
        const header = document.querySelector('.header');
        if (!filterArea || !header) return;

        // 서브 또는 GNB 헤더 중 현재 활성화된 것 감지
        const stickyTargets = header.querySelectorAll('.header-sub, .header-gnb');
        const headerHeight = 50; // 기본 헤더 높이

        const handleScroll = () => {
            const rect = filterArea.getBoundingClientRect();
            // 필터 영역 상단이 헤더 하단(혹은 상단 근처)에 도달하면 헤더에 클래스 추가
            if (rect.top <= headerHeight) {
                stickyTargets.forEach(h => h.classList.add('is-pushed'));
            } else {
                stickyTargets.forEach(h => h.classList.remove('is-pushed'));
            }
        };

        // 스크롤 이벤트 바인딩 (성능을 위해 requestAnimationFrame 고려 가능하나 Simple 우선)
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // 초기 상태 반영
    }
};
