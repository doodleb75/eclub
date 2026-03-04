import { Const } from './constants.js';

export const BrowserZoom = {
    zoomLevel: 100, // 초기화 시 DEFAULT 기준 설정

    init() {
        // 상수 참조
        this.min = Const.ZOOM.MIN;
        this.max = Const.ZOOM.MAX;
        this.step = Const.ZOOM.STEP;
        this.zoomLevel = Const.ZOOM.DEFAULT;

        const savedZoom = localStorage.getItem('eclub_zoom_level');
        if (savedZoom) {
            this.zoomLevel = parseInt(savedZoom, 10);
        }

        // 초기 줌 배율 적용
        this.applyZoom();

        // 이벤트 위임 처리
        document.addEventListener('click', (e) => {
            const container = e.target.closest('.browser-zoom');
            if (!container) return; // browser-zoom 내부가 아니면 무시

            const btnIn = e.target.closest('.btn-zoom-in');
            const btnOut = e.target.closest('.btn-zoom-out');

            if (btnIn) {
                this.changeZoom(this.step);
            } else if (btnOut) {
                this.changeZoom(-this.step);
            }
        });
    },

    changeZoom(delta) {
        const newLevel = this.zoomLevel + delta;
        if (newLevel >= this.min && newLevel <= this.max) {
            this.zoomLevel = newLevel;
            this.applyZoom();
            localStorage.setItem('eclub_zoom_level', this.zoomLevel);
        }
    },

    applyZoom() {
        document.body.style.zoom = `${this.zoomLevel}%`;
        const display = document.querySelector('.browser-zoom .zoom-value');
        if (display) {
            display.textContent = `${this.zoomLevel}%`;
        }
        // 레이아웃 재계산 (슬라이더 대응)
        window.dispatchEvent(new Event('resize'));
    }
};

// 줌 배율 반환 글로벌 함수
export const getZoomScale = () => {
    const zoom = document.body.style.zoom;
    if (!zoom) return 1;
    return parseFloat(zoom) / 100;
};
