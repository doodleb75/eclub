/**
 * 전역 레이어 팝업 (범용 툴팁 시스템)
 * - 버튼의 data-popover-template 속성에 따라 마크업을 동적으로 생성합니다.
 */
const Popover = (() => {
    let instance = null;
    let lastTrigger = null; // 마지막으로 팝업을 트리거한 요소

    // 1. 디자인 타입별 HTML 템플릿 정의
    const templates = {
        // [디자인 1] 할인 내역 상세 (기존 구현 디자인)
        discount: (data) => `
            <div class="popover-inner">
                <div class="popover-header">
                    <span class="title">${data.title || '할인내역'}</span>
                    <span class="qty">수량 <span class="num">${data.qty || 0}</span></span>
                </div>
                <div class="popover-content">
                    <div class="price-summary">
                        <div class="price-row">
                            <span class="label">정상가</span>
                            <span class="val">${data.original || '0원'}</span>
                        </div>
                        <div class="price-row">
                            <span class="label hidden-toggle">최근 20일 최저가</span>
                            <span class="val">${data.lowest || '0원'}</span>
                        </div>
                        <div class="price-row sale-price">
                            <span class="label">행사가</span>
                            <span class="val">${data.sale || '0원'}</span>
                        </div>
                    </div>
                    <ul class="discount-list">
                        ${(data.discounts || []).map(d => `
                            <li><span class="label">${d.label}</span> <span class="val">${d.val}</span></li>
                        `).join('')}
                    </ul>
                    <div class="final-price">
                        <span class="label">최종혜택가</span>
                        <span class="val">${data.final || '0원'}</span>
                    </div>
                </div>
                <div class="popover-footer">
                    <button type="button" class="btn-confirm">확인</button>
                </div>
            </div>
        `,
        // [디자인 2] 단순 안내 메시지
        simple: (data) => `
            <div class="popover-inner">
                <p class="message">${data.message || '안내 메시지 내용입니다.'}</p>
                <div class="popover-footer">
                    <button type="button" class="btn-confirm">확인</button>
                </div>
            </div>
        `
    };

    // 팝업 컨테이너 생성 (최초 1회)
    const init = () => {
        if (instance) return;
        const container = document.createElement('div');
        container.id = 'globalPopover';
        container.className = 'popover-layer';
        document.body.appendChild(container);
        instance = container;

        // 버튼 클릭 이벤트 위임 (팝업 내부 '확인' 버튼 등)
        instance.addEventListener('click', (e) => {
            if (e.target.closest('.btn-confirm')) {
                hide();
            }
        });
    };

    /**
     * @param {HTMLElement} trigger - 팝업을 띄운 버튼 요소
     * @param {Object} [customData] - 외부에서 직접 전달할 데이터 (선택)
     */
    const show = (trigger, customData = null) => {
        if (!instance) init();

        // 이미 같은 트리거로 활성화된 상태면 닫기 (토글 기능)
        if (instance.classList.contains('active') && lastTrigger === trigger) {
            hide();
            return;
        }

        lastTrigger = trigger;

        // 1. 템플릿 타입 결정 (기본값 discount)
        const templateType = trigger.dataset.popoverTemplate || 'discount';
        const templateFn = templates[templateType];

        if (!templateFn) {
            console.error(`Popover template "${templateType}" is not defined.`);
            return;
        }

        // 2. 데이터 구성 (data-* 속성 또는 customData)
        // 실제 운영 환경에서는 서버 연동 데이터 등을 trigger의 속성에 담아두거나 인자로 전달받음
        const baseData = {
            qty: trigger.dataset.qty,
            original: trigger.dataset.original,
            lowest: trigger.dataset.lowest,
            sale: trigger.dataset.sale,
            final: trigger.dataset.final,
            message: trigger.dataset.message
        };

        // 할인 리스트 같은 배열 데이터는 JSON으로 parse 하거나 더미 데이터 사용 (샘플용)
        if (templateType === 'discount' && !trigger.dataset.discounts) {
            baseData.discounts = [
                { label: '프로모션 5%', val: '-50원' },
                { label: '삼성카드 특가', val: '-50원' },
                { label: '결제할인쿠폰 3%', val: '-30원' },
                { label: '상품할인쿠폰 100원', val: '-100원' }
            ];
        }

        const renderData = { ...baseData, ...customData };

        // 3. HTML 렌더링 및 스타일 적용
        instance.innerHTML = templateFn(renderData);
        instance.className = `popover-layer type-${templateType} active`;

        // 4. 위치 계산
        const rect = trigger.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const popoverWidth = instance.offsetWidth;

        let left = rect.left + scrollX - (popoverWidth / 2) + (rect.width / 2);
        let top = rect.bottom + scrollY + 12;

        // 좌우 끝단 방어코드
        const margin = 10;
        if (left < margin) left = margin;
        if (left + popoverWidth > window.innerWidth - margin) {
            left = window.innerWidth - popoverWidth - margin;
        }

        instance.style.top = `${top}px`;
        instance.style.left = `${left}px`;
    };

    const hide = () => {
        if (instance) {
            instance.classList.remove('active');
            lastTrigger = null; // 트리거 정보 초기화
        }
    };

    // 바깥 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (instance && instance.classList.contains('active')) {
            if (!instance.contains(e.target) && !e.target.closest('.btn-info')) {
                hide();
            }
        }
    });

    return { show, hide };
})();

// 전역 이벤트 리스너
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-info');
    if (trigger) {
        Popover.show(trigger);
    }
});
