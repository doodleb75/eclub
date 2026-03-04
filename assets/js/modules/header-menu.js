export const HeaderMenu = {
    init() {
        // PC(.main-menu)와 Mobile(.gnb-list) 모두 대응
        const menu = document.querySelector('.main-menu, .gnb-list');
        if (!menu) return;

        const links = menu.querySelectorAll('a');
        const currentPath = window.location.pathname;

        // 초기화: 모든 active 제거
        links.forEach(l => {
            l.classList.remove('active');
            const parentLi = l.closest('li');
            if (parentLi) parentLi.classList.remove('active');
        });

        links.forEach(link => {
            const href = link.getAttribute('href');
            const li = link.closest('li');

            // 페이지 고정 로직: 현재 경로와 href가 일치하면 active 클래스 적용
            if (href && href !== '#' && href !== 'javascript:void(0);' && href !== '/') {
                // /mobile/ 또는 /mobile/index.html 등의 홈 경로 예외 처리 및 포함 여부 체크
                const isMatch = (currentPath.includes(href)) ||
                    ((currentPath === '/mobile/' || currentPath.endsWith('index.html')) && (href && href.includes('index.html')));

                if (isMatch) {
                    link.classList.add('active');
                    if (li) li.classList.add('active');
                }
            }

            link.addEventListener('click', () => {
                // 클릭 시 모든 active 제거 후 현재 요소에 추가
                links.forEach(l => {
                    l.classList.remove('active');
                    const pLi = l.closest('li');
                    if (pLi) pLi.classList.remove('active');
                });
                link.classList.add('active');
                if (li) li.classList.add('active');
            });
        });
    }
};
