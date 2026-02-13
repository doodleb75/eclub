/**
 * 엑셀 업로드 모달 전용 로직
 */
document.addEventListener('click', (e) => {
    // 찾아보기 버튼 클릭 (ID 기반 또는 클래스 기반)
    if (e.target.closest('.btn-file-search')) {
        const modalBody = e.target.closest('.modal-body');
        const fileInput = modalBody?.querySelector('#excel-file-hidden');
        if (fileInput) fileInput.click();
    }

    // 등록 버튼 클릭 시 결과 화면 전환
    if (e.target.closest('.btn-excel-submit')) {
        const modalWrap = e.target.closest('.modal-wrap');
        const fileInput = modalWrap?.querySelector('#excel-file-hidden');

        if (fileInput && !fileInput.value) {
            alert('첨부파일을 선택해주세요.');
            return;
        }

        // 화면 전환 로직
        const uploadTitle = modalWrap?.querySelector('#excel-upload-title');
        const resultTitle = modalWrap?.querySelector('#excel-result-title');
        const uploadSection = modalWrap?.querySelector('#upload-section');
        const resultSection = modalWrap?.querySelector('#result-section');
        const uploadFooter = modalWrap?.querySelector('#modal-footer-upload');
        const confirmFooter = modalWrap?.querySelector('#modal-footer-confirm');

        if (uploadTitle) uploadTitle.style.display = 'none';
        if (resultTitle) resultTitle.style.display = 'block';
        if (uploadSection) uploadSection.style.display = 'none';
        if (resultSection) resultSection.style.display = 'block';
        if (uploadFooter) uploadFooter.style.display = 'none';
        if (confirmFooter) confirmFooter.style.display = 'block';
    }
});

// 파일 선택 시 파일명 표시
document.addEventListener('change', (e) => {
    if (e.target.id === 'excel-file-hidden') {
        const modalBody = e.target.closest('.modal-body');
        const fileNameInput = modalBody?.querySelector('#excel-file-name');
        if (fileNameInput) {
            const file = e.target.files[0];
            fileNameInput.value = file ? file.name : '';
        }
    }
});

