/**
 * 엑셀 업로드 모달 전용 로직
 */
document.addEventListener('click', (e) => {
    // 찾아보기 버튼 클릭 시 파일 선택창 트리거 (이벤트 위임)
    const btnBrowse = e.target.closest('.btn-browse');
    if (btnBrowse) {
        const modal = btnBrowse.closest('.modal-excel-upload');
        const fileInput = modal.querySelector('#excelFileInput');
        if (fileInput) fileInput.click();
    }

    // 등록 버튼 클릭 시 처리 (예비)
    const btnRegister = e.target.closest('.btn-register');
    if (btnRegister) {
        const modal = btnRegister.closest('.modal-excel-upload');
        const fileName = modal.querySelector('.file-name-display').value;
        if (!fileName) {
            alert('업로드할 파일을 선택해주세요.');
            return;
        }
        // TODO: 실제 업로드 로직 구현
        console.log('Excel file upload started:', fileName);
    }
});

document.addEventListener('change', (e) => {
    // 파일 선택 시 파일명 노출
    if (e.target.id === 'excelFileInput') {
        const modal = e.target.closest('.modal-excel-upload');
        const fileNameDisplay = modal.querySelector('.file-name-display');
        if (fileNameDisplay) {
            const fileName = e.target.files[0] ? e.target.files[0].name : '';
            fileNameDisplay.value = fileName;
        }
    }
});
