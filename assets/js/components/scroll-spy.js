/**
 * Scroll Spy & Sticky Tab Logic for Cart Page
 */
document.addEventListener('DOMContentLoaded', () => {
    const tabWrap = document.querySelector('.cart-tab-wrap');
    if (!tabWrap) return;

    const methodLinks = document.querySelectorAll('.cart-tabs .tab-item:not(.recent) .tab-link');
    const sections = [];

    // 탭 헤더 높이 계산 (sticky offset 용)
    // 여유분 조금 더해서 스크롤 시 타이틀이 가려지지 않게 함
    const getHeaderHeight = () => tabWrap.offsetHeight + 20;

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
            // '전체' 탭 처리를 위한 가상의 섹션 (페이지 최상단)
            sections.push({
                id: '#wrap',
                el: document.body, // 혹은 document.querySelector('#wrap')
                link: link,
                parent: link.closest('.tab-item')
            });
        }
    });

    // 1. 클릭 이동 (Smooth Scroll)
    methodLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');

            if (targetId === '#wrap' || targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    const top = targetEl.getBoundingClientRect().top + window.scrollY - getHeaderHeight();
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            }
        });
    });

    // 2. 스크롤 감지 (Scroll Spy)
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (isScrolling) return;
        isScrolling = true;

        requestAnimationFrame(() => {
            const scrollPos = window.scrollY + getHeaderHeight() + 50; // 감지 오프셋 보정

            // 현재 활성화할 섹션 찾기
            let currentSection = null;

            for (const section of sections) {
                const offsetTop = section.el === document.body ? 0 : (section.el.getBoundingClientRect().top + window.scrollY);

                if (scrollPos >= offsetTop) {
                    currentSection = section;
                }
            }

            // 모든 탭 active 제거 후 현재 섹션 탭 active
            if (currentSection) {
                methodLinks.forEach(l => l.closest('.tab-item').classList.remove('active'));
                currentSection.parent.classList.add('active');
            }

            isScrolling = false;
        });
    });
});
