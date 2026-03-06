export const MypageSidebar = {
    init() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('.mypage-menu .menu-link');
        
        if (!menuLinks || menuLinks.length === 0) return;

        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === 'javascript:void(0);') return;

            // 사이드바 링크의 href 값과 현재 경로가 정확히 일치하거나,
            // 상세 조회 페이지 등 특정 패턴에 맞는 경우 active 클래스 추가
            
            if (currentPath.includes(href)) {
                link.classList.add('active');
            } else {
                // 특정 페이지 매핑 예외 처리 (리스트 <-> 영수증 등)
                if (currentPath.includes('order-history-list') && href.includes('order-history-receipt')) {
                    link.classList.add('active');
                }
            }
        });
    }
};
