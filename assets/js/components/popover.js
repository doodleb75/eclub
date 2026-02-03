/**
 * 전역 레이어 팝업 (범용 툴팁 시스템)
 * - 버튼의 data-popover-template 속성에 따라 마크업을 동적으로 생성합니다.
 * - 템플릿 HTML은 /common/components/popover/ 폴더에서 비동기로 로드합니다.
 */
const Popover = {
    // 설정 및 상수
    config: {
        templatePath: '/eclub/common/components/popover/',
        defaultType: 'discount',
        margin: 10
    },

    instance: null,
    lastTrigger: null,
    templateCache: {},

    // 템플릿 로드 (캐싱 적용)
    async loadTemplate(type) {
        if (this.templateCache[type]) return this.templateCache[type];
        try {
            const response = await fetch(`${this.config.templatePath}${type}.html`);
            if (!response.ok) throw new Error(`Template load failed: ${type}`);
            const html = await response.text();
            this.templateCache[type] = html;
            return html;
        } catch (e) {
            console.warn(`[Popover] Failed to load template: ${type}`, e);
            return null;
        }
    },

    // 위치 계산 로직
    calculatePosition(trigger, popover, type) {
        const rect = trigger.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        const popoverWidth = popover.offsetWidth;
        const windowWidth = window.innerWidth;

        let top, left;

        // 기본 위치 설정
        if (type === 'pointInfo') {
            left = rect.right + scrollX + 10;
            top = rect.top + scrollY;
        } else {
            // 기본: 버튼 우측 하단 정렬
            left = rect.right + scrollX - popoverWidth;
            top = rect.bottom + scrollY + 12;
        }

        // 화면 우측 넘어감 방지
        const margin = this.config.margin;
        if (left + popoverWidth > windowWidth - margin) {
            if (type === 'pointInfo') {
                // 왼쪽으로 뒤집기
                left = rect.left + scrollX - popoverWidth - 10;
            } else {
                // 화면 안쪽으로 밀기
                left = windowWidth - margin - popoverWidth;
            }
        }

        // 좌측 최소 마진 보장
        if (left < margin) left = margin;

        return { top, left };
    },

    // 초기화 및 이벤트 바인딩
    init() {
        if (this.instance) return;

        const container = document.createElement('div');
        container.id = 'globalPopover';
        container.className = 'popover-layer';
        document.body.appendChild(container);
        this.instance = container;

        // 내부 닫기 버튼 위임
        this.instance.addEventListener('click', (e) => {
            if (e.target.closest('.btn-confirm')) {
                this.hide();
            }
        });

        // 외부 클릭 감지
        window.addEventListener('click', (e) => {
            if (this.instance && this.instance.classList.contains('active')) {
                if (!this.instance.contains(e.target) && !e.target.closest('.btn-info')) {
                    this.hide();
                }
            }
        });
    },

    hide() {
        if (this.instance) {
            this.instance.classList.remove('active');
            this.lastTrigger = null;
        }
    },

    async show(trigger, customData = null) {
        if (!this.instance) this.init();

        // 토글 처리
        if (this.instance.classList.contains('active') && this.lastTrigger === trigger) {
            this.hide();
            return;
        }
        this.lastTrigger = trigger;

        const type = trigger.dataset.popoverTemplate || this.config.defaultType;
        const templateHtml = await this.loadTemplate(type);
        if (!templateHtml) return;

        // 렌더링
        this.instance.innerHTML = templateHtml;
        this.instance.className = `popover-layer type-${type} active`;

        // 위치 적용
        const { top, left } = this.calculatePosition(trigger, this.instance, type);
        this.instance.style.top = `${top}px`;
        this.instance.style.left = `${left}px`;

        // 화면 아래 잘림 방지 스크롤
        const popoverRect = this.instance.getBoundingClientRect();
        if (popoverRect.bottom > window.innerHeight) {
            window.scrollBy({
                top: popoverRect.bottom - window.innerHeight + 20,
                behavior: 'smooth'
            });
        }
    }
};

// 초기화 이벤트
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-info');
    if (trigger) {
        Popover.show(trigger);
    }
});
