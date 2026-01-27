// 수량 조절
document.addEventListener('click', (e) => {
    // 수량 조절 버튼 클릭 확인
    const btn = e.target.closest('.qty-box button');
    if (!btn) return;

    const qtyBox = btn.closest('.qty-box');
    if (!qtyBox) return;

    const input = qtyBox.querySelector('input');
    const buttons = qtyBox.querySelectorAll('button');

    // 필수 요소(input, buttons) 존재 확인
    if (!input || buttons.length < 2) return;

    e.preventDefault();

    // 현재 수량 파싱
    let currentVal = parseInt(input.value, 10) || 0;
    // 최소값 설정
    const minVal = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 0;

    // 감소 버튼 처리
    if (btn === buttons[0]) {
        if (currentVal > minVal) {
            input.value = currentVal - 1;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    // 증가 버튼 처리
    else if (btn === buttons[1]) {
        input.value = currentVal + 1;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }
});

// 직접 입력 시 유효성 검증
document.addEventListener('input', (e) => {
    const input = e.target;
    // qty-box 내부 input 여부 확인
    if (!input.closest('.qty-box')) return;

    // 숫자 이외의 문자 제거
    input.value = input.value.replace(/[^0-9]/g, '');

    const val = parseInt(input.value, 10);

    // 최소값 설정
    const minVal = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 0;

    // 음수 방지 및 값 유효성 체크
    if (!isNaN(val) && val < 0) {
        input.value = 0;
    }
});

