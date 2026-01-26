/**
 * 전역 모달 시스템 (HTML 로드 방식)
 * - Modal.open('/path/to/file.html') 형식으로 외부 마크업을 읽어옵니다.
 */
const Modal = (() => {
    let overlay = null;
    let wrap = null;

    // 모달 기본 뼈대 생성 (최초 1회)
    const init = () => {
        if (overlay) return;

        overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        overlay.innerHTML = `
            <div class="modal-wrap">
                <!-- 외부 HTML이 삽입될 영역 -->
                <div class="modal-content"></div>
            </div>
        `;

        document.body.appendChild(overlay);
        wrap = overlay.querySelector('.modal-wrap');

        // 배경 클릭 시 닫기
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        // 닫기 버튼 이벤트 위임 (동적 생성 요소 대응)
        overlay.addEventListener('click', (e) => {
            if (e.target.closest('.btn-modal-close') || e.target.closest('.btn-confirm-option')) {
                close();
            }
        });

        // ESC 키 대응
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) close();
        });
    };

    /**
     * 모달 열기 (외부 HTML 로드)
     * @param {string} url - 불러올 HTML 파일 경로
     * @param {Object} options - 옵션 (너비, 트리거 요소 등)
     */
    const open = async (url, options = {}) => {
        if (!overlay) init();

        const trigger = options.trigger;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('HTML 로드 실패');

            const html = await response.text();
            const contentArea = overlay.querySelector('.modal-content');

            // 컨텐츠 삽입
            contentArea.innerHTML = html;

            // 추가 데이터 바인딩 (data-item-* 속성들)
            if (trigger) {
                Object.keys(trigger.dataset).forEach(key => {
                    if (key.startsWith('item')) {
                        const selector = `.modal-item-${key.slice(4).toLowerCase()}`;
                        const target = contentArea.querySelector(selector);
                        if (target) {
                            if (target.tagName === 'IMG') {
                                target.src = trigger.dataset[key];
                            } else {
                                target.textContent = trigger.dataset[key];
                            }
                        }
                    }
                });
            }

            // 옵션 적용 (너비/높이 등)
            if (options.width) {
                if (options.width.includes('%')) {
                    wrap.style.width = options.width;
                    wrap.style.maxWidth = 'none'; // % 사용 시 Max-width 해제
                } else {
                    wrap.style.maxWidth = options.width;
                    wrap.style.width = ''; // 기본값 복구
                }
            }
            if (options.height) {
                if (options.height.includes('%')) {
                    wrap.style.height = options.height;
                    wrap.style.maxHeight = 'none'; // % 사용 시 Max-height 해제
                } else {
                    wrap.style.maxHeight = options.height;
                    wrap.style.height = ''; // 기본값 복구
                }
            }

            // 노출
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // 부모 스크롤 차단

            // 삽입된 HTML 내부에 <script>가 있을 경우 실행 처리 (임시 디자인 대응)
            const scripts = contentArea.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                newScript.text = oldScript.text;
                contentArea.appendChild(newScript);
                oldScript.remove();
            });

        } catch (error) {
            console.error('Modal Open Error:', error);
            alert('정보를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const close = () => {
        if (!overlay) return;
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // 스크롤 복구

        // 애니메이션 대기 후 컨텐츠 비움
        setTimeout(() => {
            overlay.querySelector('.modal-content').innerHTML = '';
            // 관련 스타일 초기화
            wrap.style.width = '';
            wrap.style.maxWidth = '';
            wrap.style.height = '';
            wrap.style.maxHeight = '';
        }, 300);
    };

    return { open, close };
})();

// 전역 모달 트리거 감시 (이벤트 위임)
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-url]');
    if (trigger) {
        e.preventDefault();
        const url = trigger.dataset.modalUrl;
        const width = trigger.dataset.modalWidth || '500px';
        const height = trigger.dataset.modalHeight; // 높이 옵션 추가
        Modal.open(url, { width, height, trigger });
    }
});
