/**
 * 상품 옵션 설정 모달 전용 로직
 */
document.addEventListener('input', (e) => {
    // 사이즈 조절 레인지 바 이벤트 처리
    if (e.target.id === 'sizeRange') {
        const valDisplay = document.querySelector('.range-val');
        if (valDisplay) {
            valDisplay.textContent = e.target.value + '%';
        }
    }
});

// 설정 완료 버튼 클릭 등 추가 로직 필요 시 여기에 작성
