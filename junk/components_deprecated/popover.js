/**
 * 전역 레이어 팝업 (범용 툴팁 시스템)
 * - 버튼의 data-popover-template 속성에 따라 마크업을 동적으로 생성합니다.
 * - 템플릿 HTML은 /common/components/popover/ 폴더에서 비동기로 로드합니다.
 */
const Popover = {
    // 설정 및 상수
    config: {
        templatePath: '/common/components/popover/',
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
        const scale = (typeof Eclub !== 'undefined' && Eclub.getZoomScale) ? Eclub.getZoomScale() : 1;
        const rect = trigger.getBoundingClientRect();
        const scrollX = window.scrollX / scale;
        const scrollY = window.scrollY / scale;

        const popoverWidth = popover.offsetWidth;
        const popoverHeight = popover.offsetHeight;
        const windowWidth = window.innerWidth / scale; // 줌 배율 반영
        const windowHeight = window.innerHeight / scale;

        // 레이아웃 좌표 계산 (물리 좌표 / scale)
        const rectLeft = rect.left / scale;
        const rectRight = rect.right / scale;
        const rectTop = rect.top / scale;
        const rectBottom = rect.bottom / scale;

        let top, left;
        const verticalMargin = 12;

        // 기본 위치 설정 (좌우 정렬)
        const isIndexPage = document.querySelector('.main-page-wrapper');
        const productItem = trigger.closest('.product-item');

        if (type === 'pointInfo') {
            left = rectRight + scrollX + 10;
        } else if (isIndexPage && productItem && type === 'discount') {
            // 인덱스 페이지의 상품 아이템 내 할인 팝업: 상품 아이템 우측 끝에 정렬
            const itemRect = productItem.getBoundingClientRect();
            const itemRectRight = itemRect.right / scale;
            left = itemRectRight + scrollX - popoverWidth;
        } else {
            // 기본: 버튼 우측 정렬
            left = rectRight + scrollX - popoverWidth;
        }

        // 수직 위치 결정 및 하단 잘림 체크
        top = rectBottom + scrollY + verticalMargin;

        const isModalActive = document.querySelector('.modal-overlay.active');
        const viewportBottom = scrollY + windowHeight;

        // 화면 하단 경계를 넘어가거나, 모달 안에서 공간이 부족할 경우 위로 띄움
        if (top + popoverHeight > viewportBottom - this.config.margin) {
            top = rectTop + scrollY - popoverHeight - verticalMargin;
        }

        // 화면 우측 넘어감 방지
        const margin = this.config.margin;
        if (left + popoverWidth > windowWidth - margin) {
            if (type === 'pointInfo') {
                left = rectLeft + scrollX - popoverWidth - 10;
            } else {
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

        // 내부 버튼 이벤트 위임 (확인, 취소, 닫기)
        this.instance.addEventListener('click', (e) => {
            if (e.target.closest('.btn-confirm') || e.target.closest('.btn-cancel') || e.target.closest('.btn-close')) {
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

        // 스크롤 시 팝오버 닫기 (모달 내부에서 호출된 경우에만)
        window.addEventListener('scroll', (e) => {
            if (this.instance && this.instance.classList.contains('active')) {
                // 팝오버 내부 자체 스크롤은 제외
                if (this.instance.contains(e.target)) return;

                // 트리거가 모달 내부에 있는 경우에만 닫음 (본문에서는 따라가도록 놔둠)
                if (this.lastTrigger && this.lastTrigger.closest('.modal-overlay')) {
                    this.hide();
                }
            }
        }, true);
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

        // 화면 아래 잘림 방지 스크롤 (모달이 없을 때만 실행)
        const isModalActive = document.querySelector('.modal-overlay.active');
        if (!isModalActive) {
            const scale = (typeof Eclub !== 'undefined' && Eclub.getZoomScale) ? Eclub.getZoomScale() : 1;
            const popoverRect = this.instance.getBoundingClientRect();
            if (popoverRect.bottom > window.innerHeight) {
                window.scrollBy({
                    top: (popoverRect.bottom - window.innerHeight + 20) / scale,
                    behavior: 'smooth'
                });
            }
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
