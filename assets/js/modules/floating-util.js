export const FloatingUtil = {
    init() {
        const floatingContainer = document.querySelector('.floating-util');
        const btnBack = document.getElementById('btn-floating-back');
        const btnTop = document.getElementById('btn-floating-top');
        const btnQuick = document.getElementById('btn-mobile-quick');

        if (!floatingContainer) {
            return;
        }
        if (floatingContainer._isInit) return;
        floatingContainer._isInit = true;

        console.log('[FloatingUtil] Init', {
            btnBack: !!btnBack,
            btnTop: !!btnTop,
            history: window.history.length
        });

        // 상품 상세 하단 구매 영역 대응
        const purchaseArea = document.querySelector('.product-purchase-area');
        if (purchaseArea) {
            floatingContainer.classList.add('has-purchase-area');
        }

        // 위치 보정 (바텀 시트 대응)
        const sheetEl = document.querySelector('.bottom-sheet');
        if (sheetEl) {
            floatingContainer.classList.add('has-bottom-sheet');
        }


        if (btnBack) {
            if (window.history.length > 1) {
                btnBack.classList.remove('is-hidden');
            } else {
                btnBack.classList.add('is-hidden');
            }
            btnBack.addEventListener('click', () => {
                if (window.history.length > 1) {
                    window.history.back();
                }
            });
        }

        if (btnTop) {
            const quickMenuLayer = document.getElementById('quick-menu-layer');

            const checkScroll = () => {
                if (window.scrollY > 300) {
                    btnTop.classList.remove('is-hidden');
                    if (btnQuick) btnQuick.classList.add('move-up');
                    if (quickMenuLayer) quickMenuLayer.classList.add('move-up');
                } else {
                    btnTop.classList.add('is-hidden');
                    if (btnQuick) btnQuick.classList.remove('move-up');
                    if (quickMenuLayer) quickMenuLayer.classList.remove('move-up');
                }
            };

            window.addEventListener('scroll', checkScroll, { passive: true });
            checkScroll();

            btnTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
};
