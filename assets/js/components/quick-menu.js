/**
 * 퀵메뉴 (지인추천 플로팅 메뉴) 스크립트
 */
const initQuickMenu = () => {
    QuickMenu.init();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickMenu);
} else {
    initQuickMenu();
}

const QuickMenu = {
    init() {
        this.initBanner();
        this.initScrollTop();
    },

    /**
     * 베너 롤링 초기화 (무한 루프)
     */
    initBanner() {
        const bannerContainer = document.querySelector('.quick-menu .banner-list');
        const prevBtn = document.querySelector('.quick-menu .btn-prev');
        const nextBtn = document.querySelector('.quick-menu .btn-next');

        if (!bannerContainer) return;

        const bannerItems = bannerContainer.querySelectorAll('.banner-item');
        if (bannerItems.length <= 1) return; // 1개 이하면 롤링 미지원

        let isAnimating = false;
        let rollingInterval = null;

        /**
         * 다음 슬라이드로 이동
         */
        const moveNext = () => {
            if (isAnimating) return;
            isAnimating = true;

            // 애니메이션 적용하여 이동
            bannerContainer.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            bannerContainer.style.transform = `translateX(-100%)`;

            setTimeout(() => {
                // 첫 번째 요소를 맨 뒤로 이동 후 위치 초기화
                bannerContainer.appendChild(bannerContainer.firstElementChild);
                bannerContainer.style.transition = 'none';
                bannerContainer.style.transform = `translateX(0)`;
                isAnimating = false;
            }, 400); // transition 시간과 동일하게 설정
        };

        /**
         * 이전 슬라이드로 이동
         */
        const movePrev = () => {
            if (isAnimating) return;
            isAnimating = true;

            // 맨 마지막 요소를 맨 앞으로 이동
            bannerContainer.insertBefore(bannerContainer.lastElementChild, bannerContainer.firstElementChild);
            // 위치를 -100%로 설정해서 제자리에 있는 것처럼 보이도록 조정 (애니메이션 없이)
            bannerContainer.style.transition = 'none';
            bannerContainer.style.transform = `translateX(-100%)`;

            // 브라우저 렌더링 프레임 대기 후 다음 동작 실행
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // 애니메이션 적용하여 0까지 다시 스와이프 되도록 설정
                    bannerContainer.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    bannerContainer.style.transform = `translateX(0)`;

                    setTimeout(() => {
                        isAnimating = false;
                    }, 400); // transition 시간과 동일하게 설정
                });
            });
        };

        // 자동 롤링 시작
        const startRolling = () => {
            stopRolling(); // 기존 인터벌 초기화
            rollingInterval = setInterval(() => {
                moveNext();
            }, 4000); // 4초 간격
        };

        // 자동 롤링 정지
        const stopRolling = () => {
            if (rollingInterval) {
                clearInterval(rollingInterval);
                rollingInterval = null;
            }
        };

        // 이전 버튼 클릭
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopRolling();
                movePrev();
                startRolling();
            });
        }

        // 다음 버튼 클릭
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopRolling();
                moveNext();
                startRolling();
            });
        }

        startRolling();
    },

    /**
     * 최상단으로 이동 (TOP 버튼)
     */
    initScrollTop() {
        document.addEventListener('click', (e) => {
            const scrollTopBtn = e.target.closest('.quick-menu .btn-top');
            if (!scrollTopBtn) return;

            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};
