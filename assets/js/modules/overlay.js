export const OverlayManager = {
    open(element, overlayElement = null) {
        if (element) {
            element.classList.add('is-open');
            element.classList.add('open');
        }
        if (overlayElement) overlayElement.classList.add('is-visible');
        document.body.classList.add('no-scroll');
        document.body.style.overflow = 'hidden'; // fallback
    },
    close(element, overlayElement = null) {
        if (element) {
            element.classList.remove('is-open');
            element.classList.remove('open');
        }
        if (overlayElement) overlayElement.classList.remove('is-visible');
        document.body.classList.remove('no-scroll');
        document.body.style.overflow = ''; // fallback
    }
};
