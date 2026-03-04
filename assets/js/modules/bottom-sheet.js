import { OverlayManager } from './overlay.js';

export const BottomSheet = {
    init() {
        const sheets = document.querySelectorAll('.bottom-sheet');
        sheets.forEach(sheet => {
            const header = sheet.querySelector('.sheet-header');
            const body = sheet.querySelector('.sheet-body');
            if (!header || !body) return;

            header.addEventListener('click', (e) => {
                e.preventDefault();
                const isExpanded = sheet.classList.contains('is-expanded');

                if (isExpanded) {
                    this.collapse(sheet, body);
                } else {
                    this.expand(sheet, body);
                }
            });
        });
    },
    expand(sheet, body) {
        sheet.classList.add('is-expanded');
        body.style.maxHeight = body.scrollHeight + 'px';
        const overlay = document.querySelector('.sheet-overlay');
        OverlayManager.open(null, overlay);
    },
    collapse(sheet, body) {
        sheet.classList.remove('is-expanded');
        body.style.maxHeight = '0';
        const overlay = document.querySelector('.sheet-overlay');
        OverlayManager.close(null, overlay);
    }
};
