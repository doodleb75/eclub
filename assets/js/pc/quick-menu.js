/**
 * 퀵메뉴 (지인추천 플로팅 메뉴) 스크립트
 */
document.addEventListener('DOMContentLoaded', () => {
    QuickMenu.init();
});

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
        const totalItems = bannerItems.length;
        if (totalItems <= 1) return; // 1개 이하면 롤링 미지원

        let currentIndex = 0;
        let rollingInterval = null;

        /**
         * 슬라이드 이동 함수
         * @param {number} index 이동할 인덱스
         */
        const moveBanner = (index) => {
            bannerContainer.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        // 자동 롤링 시작
        const startRolling = () => {
            rollingInterval = setInterval(() => {
                let nextIndex = (currentIndex + 1) % totalItems;
                moveBanner(nextIndex);
            }, 4000); // 4초 간격
        };

        // 자동 롤링 정지
        const stopRolling = () => {
            if (rollingInterval) clearInterval(rollingInterval);
        };

        // 이전 버튼 클릭
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopRolling();
                let nextIndex = (currentIndex - 1 + totalItems) % totalItems;
                moveBanner(nextIndex);
                startRolling();
            });
        }

        // 다음 버튼 클릭
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopRolling();
                let nextIndex = (currentIndex + 1) % totalItems;
                moveBanner(nextIndex);
                startRolling();
            });
        }

        startRolling();
    },

    /**
     * 최상단으로 이동 (TOP 버튼)
     */
    initScrollTop() {
        const scrollTopBtn = document.querySelector('.quick-menu .btn-top');
        if (!scrollTopBtn) return;

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};
