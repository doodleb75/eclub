export const Loader = {
    overlay: null,
    requestCount: 0,

    async init() {
        // 오버레이 생성
        if (!document.querySelector('.loading-overlay')) {
            const loaderHTML = `
                <div class="loading-overlay" style="display: none;">
                    <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('afterbegin', loaderHTML);
        }

        this.overlay = document.querySelector('.loading-overlay');

        // HTML Include
        let includes = document.querySelectorAll('[data-include]');
        while (includes.length > 0) {
            const promises = Array.from(includes).map(async (el) => {
                const url = el.dataset.include;
                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        let html = await res.text();

                        // 동적으로 페이지 타이틀 변경 지원 (ex: data-page-title="타이틀 명")
                        if (el.dataset.pageTitle) {
                            html = html.replace(/<h1 class="page-title">.*?<\/h1>/, `<h1 class="page-title">${el.dataset.pageTitle}</h1>`);
                        }

                        el.outerHTML = html;
                    } else {
                        console.error('로드 실패:', url);
                        el.removeAttribute('data-include'); // 무한루프 방지
                    }
                } catch (e) {
                    console.error('인클루드 오류:', url, e);
                    el.removeAttribute('data-include'); // 무한루프 방지
                }
            });
            await Promise.all(promises);
            includes = document.querySelectorAll('[data-include]');
        }

        // 통신 감지 인터셉터
        this.enableInterceptor();
    },

    enableInterceptor() {
        const self = this;

        // Fetch 인터셉트
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            self.requestCount++;
            self.show();

            try {
                const response = await originalFetch(...args);
                return response;
            } catch (error) {
                throw error;
            } finally {
                self.requestCount--;
                if (self.requestCount <= 0) {
                    // 깜빡임 방지 (Delay)
                    setTimeout(() => {
                        if (self.requestCount <= 0) {
                            self.requestCount = 0;
                            self.hide();
                        }
                    }, 300);
                }
            }
        };

        // XHR 인터셉트
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function (...args) {
            return originalOpen.apply(this, args);
        };

        XMLHttpRequest.prototype.send = function (...args) {
            self.requestCount++;
            self.show();

            this.addEventListener('loadend', () => {
                self.requestCount--;
                if (self.requestCount <= 0) {
                    setTimeout(() => {
                        if (self.requestCount <= 0) {
                            self.requestCount = 0;
                            self.hide();
                        }
                    }, 300);
                }
            });

            return originalSend.apply(this, args);
        };
    },

    show() {
        if (!this.overlay) this.overlay = document.querySelector('.loading-overlay');
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            this.overlay.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        }
    },

    hide() {
        if (!this.overlay) this.overlay = document.querySelector('.loading-overlay');
        // 요청이 남아있으면 숨기지 않음
        if (this.requestCount > 0) return;

        if (this.overlay) {
            this.overlay.style.display = 'none';
            this.overlay.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    }
};
