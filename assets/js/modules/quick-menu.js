export const QuickMenu = {
    init() {
        const btn = document.getElementById('btn-mobile-quick');
        const layer = document.getElementById('quick-menu-layer');
        if (!btn || !layer) return;

        const closeBtn = layer.querySelector('.btn-quick-close');

        // 메뉴 노출
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.open(btn, layer);
        });

        // 메뉴 숨김
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.close(btn, layer);
            });
        }

        // 외부 클릭 대응
        document.addEventListener('click', (e) => {
            if (layer.hidden) return;
            // 레이어 내부나 버튼을 클릭한 경우는 제외
            if (!layer.contains(e.target) && !btn.contains(e.target)) {
                this.close(btn, layer);
            }
        });
    },

    open(btn, layer) {
        btn.classList.add('is-hidden');
        layer.hidden = false;
    },

    close(btn, layer) {
        btn.classList.remove('is-hidden');
        layer.hidden = true;
    }
};
