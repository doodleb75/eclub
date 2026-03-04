export const CustomSelect = {
    init() {
        document.addEventListener('click', (e) => {
            const label = e.target.closest('.custom-select .select-label');
            const option = e.target.closest('.custom-select .select-options li');
            const allSelects = document.querySelectorAll('.custom-select');

            // 라벨 클릭 처리
            if (label) {
                const select = label.closest('.custom-select');
                const isOpen = select.classList.contains('is-open');

                // 외부 드롭다운 닫기
                allSelects.forEach(s => s.classList.remove('is-open'));

                if (!isOpen) {
                    select.classList.add('is-open');
                }
                return;
            }

            // 옵션 선택 처리
            if (option) {
                const select = option.closest('.custom-select');
                const labelText = select.querySelector('.select-label');
                const icon = labelText.querySelector('i');

                // 값 변경 (아이콘 보존 및 말줄임 대응을 위해 span 래핑)
                labelText.innerHTML = `<span>${option.textContent}</span> <i class="${icon.className}"></i>`;

                // active 상태 갱신
                select.querySelectorAll('li').forEach(li => li.classList.remove('active'));
                option.classList.add('active');

                select.classList.remove('is-open');
                return;
            }

            // 외부 클릭 해제
            allSelects.forEach(s => s.classList.remove('is-open'));
        });
    }
};
