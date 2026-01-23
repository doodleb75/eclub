// 수량 조절 기능 
document.addEventListener('click', (e) => {
    // 수량 조절 버튼 클릭 확인
    const btn = e.target.closest('.qty-box button');
    if (!btn) return;

    const qtyBox = btn.closest('.qty-box');
    if (!qtyBox) return;

    const input = qtyBox.querySelector('input');
    const buttons = qtyBox.querySelectorAll('button');

    // 구조 유효성 검사 (버튼 2개, 인풋 1개 필수)
    if (!input || buttons.length < 2) return;

    e.preventDefault();

    // 현재 값 파싱
    let currentVal = parseInt(input.value, 10) || 0;
    // 최소값 확인 (속성이 없으면 기본 0)
    const minVal = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 0;

    // 마이너스 버튼 (첫 번째 버튼)
    if (btn === buttons[0]) {
        if (currentVal > minVal) {
            input.value = currentVal - 1;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    // 플러스 버튼 (두 번째 버튼)
    else if (btn === buttons[1]) {
        input.value = currentVal + 1;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }
});

// 직접 입력 시 유효성 검사 (Input Event Delegation)
document.addEventListener('input', (e) => {
    const input = e.target;
    // qty-box 내부의 input인지 확인
    if (!input.closest('.qty-box')) return;

    // 숫자 이외의 문자 제거
    input.value = input.value.replace(/[^0-9]/g, '');

    const val = parseInt(input.value, 10);

    // 최소값 확인 (속성이 없으면 기본 0)
    const minVal = input.hasAttribute('min') ? parseInt(input.getAttribute('min'), 10) : 0;

    // 빈 값이 아니고 최소값보다 작으면 최소값으로 설정 (단, 입력 중 편의를 위해 blur에서 처리하는 것이 일반적이나, 여기서는 음수 방지 등이 목적이므로 단순 숫자 필터링만 적용하고 값 범위는 change/blur에서 처리하는게 나을 수 있음. 하지만 사용자 요청은 "0 밑으로는 넣을 수 없어야 돼" 이므로 숫자만 허용하면 됨)
    // 원래 로직 유지하되 숫자만 허용하도록 변경함.

    // 만약 값이 있고 음수라면 0 (이미 정규식으로 -기호가 제거되어 음수는 불가능하지만 안전장치)
    if (!isNaN(val) && val < 0) {
        input.value = 0;
    }
});

