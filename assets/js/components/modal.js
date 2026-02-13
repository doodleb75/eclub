// 전역 모달 시스템
const Modal = (() => {
    let overlay = null;
    let wrap = null;
    let closeTimer = null; // 닫기 애니메이션 타이머
    const cache = new Map(); // HTML 캐싱

    const init = () => {
        if (overlay) return;
        overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-wrap">
                <div class="modal-content"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        wrap = overlay.querySelector('.modal-wrap');

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target.closest('.btn-modal-close') || e.target.closest('.btn-confirm-option')) {
                close();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) close();
        });
    };

    // 데이터 자동 추출
    const bindSmartData = (contentArea, trigger) => {
        const itemContainer = trigger.closest('.cart-item');

        // 상품명 추출 (dataset 우선)
        const name = trigger.dataset.itemName || (itemContainer && itemContainer.querySelector('.item-name')?.textContent);
        if (name) {
            const nameTarget = contentArea.querySelector('.modal-item-name');
            if (nameTarget) nameTarget.textContent = name;
        }

        // 이미지 추출 (dataset/img 우선)
        const img = trigger.dataset.itemImg || trigger.querySelector('img')?.src || (itemContainer && itemContainer.querySelector('img')?.src);
        if (img) {
            const imgTarget = contentArea.querySelector('.modal-item-img');
            if (imgTarget) imgTarget.src = img;
        }

        // 기타 data-item-* 매핑
        Object.keys(trigger.dataset).forEach(key => {
            if (key.startsWith('item')) {
                const selector = `.modal-item-${key.slice(4).toLowerCase()}`;
                const target = contentArea.querySelector(selector);
                if (target && !target.dataset.discoveryDone) {
                    if (target.tagName === 'IMG') target.src = trigger.dataset[key];
                    else target.textContent = trigger.dataset[key];
                }
            }
        });
    };

    const open = async (url, options = {}) => {
        // 연속 호출 시 이전 닫기 작업 취소
        if (closeTimer) {
            clearTimeout(closeTimer);
            closeTimer = null;
        }

        if (!overlay) init();
        const contentArea = overlay.querySelector('.modal-content');
        let html = '';

        try {
            // Template ID 로드
            if (url.startsWith('#')) {
                const template = document.querySelector(url);
                html = template ? template.innerHTML : '';
            }
            // 외부 파일 fetch 및 캐싱
            else {
                if (cache.has(url)) {
                    html = cache.get(url);
                } else {
                    const response = await fetch(url);
                    html = await response.text();
                    cache.set(url, html);
                }
            }

            contentArea.innerHTML = html;
            if (options.trigger) bindSmartData(contentArea, options.trigger);

            // 스타일 적용
            if (options.width) {
                wrap.style.width = options.width.includes('%') ? options.width : '';
                wrap.style.maxWidth = options.width.includes('%') ? 'none' : options.width;
            }
            if (options.height) {
                wrap.style.height = options.height.includes('%') ? options.height : '';
                wrap.style.maxHeight = options.height.includes('%') ? 'none' : options.height;
            }

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; // 모바일 대응

            // 스크립트 실행
            contentArea.querySelectorAll('script').forEach(oldScript => {
                const newScript = document.createElement('script');
                newScript.text = oldScript.text;
                contentArea.appendChild(newScript);
                oldScript.remove();
            });

        } catch (error) {
            console.error('Modal Open Error:', error);
        }
    };

    const close = () => {
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // 대기 중인 타이머 제거
        if (closeTimer) clearTimeout(closeTimer);

        // 애니메이션 종료 후 리소스 정리
        closeTimer = setTimeout(() => {
            // 재오픈 되지 않았을 때만 비우기
            if (!overlay.classList.contains('active')) {
                overlay.querySelector('.modal-content').innerHTML = '';
                wrap.style = '';
            }
            closeTimer = null;
        }, 300);
    };

    return { open, close };
})();

document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-url]');
    if (trigger) {
        e.preventDefault();
        Modal.open(trigger.dataset.modalUrl, {
            width: trigger.dataset.modalWidth || '500px',
            height: trigger.dataset.modalHeight,
            trigger
        });
    }
});
