/**
 * Scroll Spy & Sticky Tab Logic for Cart Page
 */
document.addEventListener('DOMContentLoaded', () => {
    const tabWrap = document.querySelector('.cart-tab-wrap');
    if (!tabWrap) return;

    const methodLinks = document.querySelectorAll('.cart-tabs .tab-item:not(.recent) .tab-link');
    const sections = [];

    // 탭 헤더 높이 계산 (sticky offset 용)
    // 헤더(50px) + 탭(50px) = 약 100px 공간 필요
    const getHeaderHeight = () => {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 50;
        return headerHeight + tabWrap.offsetHeight;
    };

    // 섹션 맵핑
    methodLinks.forEach(link => {
        const id = link.getAttribute('href');
        if (id && id.startsWith('#') && id !== '#') {
            const section = document.querySelector(id);
            if (section) {
                sections.push({
                    id: id,
                    el: section,
                    link: link,
                    parent: link.closest('.tab-item')
                });
            }
        } else if (id === '#wrap') {
            sections.push({
                id: '#wrap',
                el: document.body,
                link: link,
                parent: link.closest('.tab-item')
            });
        }
    });

    // 2. 스크롤 감지 (Scroll Spy) 및 상태 변수
    let isAutoScrolling = false; // 클릭으로 인한 자동 스크롤 중 여부
    let scrollTimeout = null;
    let isThrottled = false;     // 스크롤 이벤트 성능 최적화용

    // 1. 클릭 이동 (Smooth Scroll)
    methodLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');

            // 즉시 활성화 처리
            methodLinks.forEach(l => l.closest('.tab-item').classList.remove('active'));
            link.closest('.tab-item').classList.add('active');

            // 자동 스크롤 모드 진입 (스파이 동작 일시 정지)
            isAutoScrolling = true;
            if (scrollTimeout) clearTimeout(scrollTimeout);

            // 스크롤이 끝났다고 판단할 안전 장치 (1.2초 후 해제)
            scrollTimeout = setTimeout(() => {
                isAutoScrolling = false;
            }, 1200);

            if (targetId === '#wrap' || targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    const offset = getHeaderHeight();
                    const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            }
        });
    });

    // 3. 스크롤 이벤트 리스너
    window.addEventListener('scroll', () => {
        // 자동 스크롤 중이면 로직 무시 (UI 떨림 방지)
        if (isAutoScrolling) return;

        // 성능 최적화 (Throttling)
        if (isThrottled) return;
        isThrottled = true;

        requestAnimationFrame(() => {
            const offset = getHeaderHeight();
            const scrollPos = window.scrollY + offset + 10;

            // 현재 활성화할 섹션 찾기
            let currentSection = null;

            for (const section of sections) {
                const offsetTop = section.el === document.body ? 0 : (section.el.getBoundingClientRect().top + window.scrollY);

                if (scrollPos >= offsetTop) {
                    currentSection = section;
                }
            }

            if (currentSection) {
                methodLinks.forEach(l => l.closest('.tab-item').classList.remove('active'));
                currentSection.parent.classList.add('active');
            }

            isThrottled = false;
        });
    });
});
