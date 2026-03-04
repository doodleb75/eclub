export const QuickMenuScroll = {
    init() {
        const container = document.querySelector('.quick-menu-container');
        const thumb = document.querySelector('.quick-menu-section .scroll-thumb');
        if (!container || !thumb) return;

        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;

        const updateThumb = () => {
            const scrollLeft = container.scrollLeft;
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;

            const maxScroll = scrollWidth - clientWidth;
            if (maxScroll <= 0) {
                thumb.style.width = '0';
                return;
            }

            const scrollRatio = scrollLeft / maxScroll;
            const track = thumb.parentElement;
            const trackWidth = track.clientWidth;

            // 썸네일 너비 계산
            const thumbWidth = (clientWidth / scrollWidth) * trackWidth;
            thumb.style.width = `${Math.max(thumbWidth, 20)}px`;

            // 위치 이동
            const maxThumbTranslate = trackWidth - thumb.offsetWidth;
            const translateX = scrollRatio * maxThumbTranslate;
            thumb.style.transform = `translateX(${translateX}px)`;
        };

        // 드래그 시작
        const onDragStart = (e) => {
            isDragging = true;
            startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            startScrollLeft = container.scrollLeft;
            thumb.classList.add('is-dragging');
            document.body.style.userSelect = 'none';
        };

        // 드래그 이동
        const onDragMove = (e) => {
            if (!isDragging) return;

            if (e.cancelable) e.preventDefault();

            const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const deltaX = currentX - startX;

            const track = thumb.parentElement;
            const trackWidth = track.clientWidth;
            const maxThumbTranslate = trackWidth - thumb.offsetWidth;
            const maxScroll = container.scrollWidth - container.clientWidth;

            if (maxThumbTranslate <= 0) return;

            // 스크롤 동기화
            const scrollDelta = (deltaX / maxThumbTranslate) * maxScroll;
            container.scrollLeft = startScrollLeft + scrollDelta;
        };

        // 드래그 종료
        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            thumb.classList.remove('is-dragging');
            document.body.style.userSelect = '';
        };

        // 이벤트 바인딩
        thumb.addEventListener('mousedown', onDragStart);
        thumb.addEventListener('touchstart', onDragStart, { passive: true });

        window.addEventListener('mousemove', onDragMove, { passive: false });
        window.addEventListener('touchmove', onDragMove, { passive: false });
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('touchend', onDragEnd);

        container.addEventListener('scroll', updateThumb);
        window.addEventListener('resize', updateThumb);

        // 초기 실행
        updateThumb();
    }
};
