/**
 * Cart Selection Component
 * 장바구니 전체 선택, 그룹 선택, 개별 선택 동기화 로직
 */
const cartSelection = (() => {
    const init = () => {
        // 장바구니 컨테이너 확인
        const container = document.querySelector('.cart-container');
        if (!container) return;

        // 전체 선택 체크박스 (상단)
        const masterCheckbox = document.querySelector('.cart-select-bar .checkbox-container input[type="checkbox"]');
        if (!masterCheckbox) return;

        // 모든 그룹 요소 조회
        const groups = container.querySelectorAll('.cart-group');

        // 1. 전체 선택 이벤트 핸들러
        masterCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            toggleAll(isChecked, groups);
        });

        groups.forEach(group => {
            const groupHeaderCheckbox = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
            const itemCheckboxes = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');

            if (!groupHeaderCheckbox) return;

            // 2. 그룹 선택 이벤트 핸들러
            groupHeaderCheckbox.addEventListener('click', (e) => {
                // 부모 전파 방지 (필요 시)
                // e.stopPropagation(); 
            });

            groupHeaderCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                toggleGroupItems(isChecked, itemCheckboxes);
                updateMasterState(masterCheckbox);
            });

            // 3. 개별 아이템 선택 이벤트 핸들러
            itemCheckboxes.forEach(itemCheckbox => {
                itemCheckbox.addEventListener('change', () => {
                    updateGroupHeaderState(groupHeaderCheckbox, itemCheckboxes);
                    updateMasterState(masterCheckbox);
                });
            });
        });
    };

    // 전체 상태 토글 (그룹 및 하위 아이템 모두)
    const toggleAll = (isChecked, groups) => {
        groups.forEach(group => {
            const groupHeaderCheckbox = group.querySelector('.group-header .checkbox-container input[type="checkbox"]');
            const itemCheckboxes = group.querySelectorAll('.cart-item .item-check input[type="checkbox"]');

            // 그룹 헤더 상태 변경
            if (groupHeaderCheckbox) {
                groupHeaderCheckbox.checked = isChecked;
            }

            // 그룹 내 아이템 상태 변경
            itemCheckboxes.forEach(cb => cb.checked = isChecked);
        });
    };

    // 그룹 내 아이템 일괄 토글
    const toggleGroupItems = (isChecked, itemCheckboxes) => {
        itemCheckboxes.forEach(cb => cb.checked = isChecked);
    };

    // 그룹 헤더 상태 업데이트 (아이템 상태에 따라)
    const updateGroupHeaderState = (groupHeaderCheckbox, itemCheckboxes) => {
        // 아이템이 하나도 없으면 로직 수행 안함
        if (itemCheckboxes.length === 0) return;

        // 모든 아이템이 체크되어 있는지 확인
        const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);
        groupHeaderCheckbox.checked = allChecked;
    };

    // 전체 선택 체크박스 상태 업데이트 (모든 아이템 상태에 따라)
    const updateMasterState = (masterCheckbox) => {
        // 화면 내 모든 아이템 체크박스 조회
        const allItemCheckboxes = document.querySelectorAll('.cart-item .item-check input[type="checkbox"]');

        if (allItemCheckboxes.length === 0) {
            masterCheckbox.checked = false;
            return;
        }

        // 하나라도 체크 해제되어 있으면 전체 선택 해제
        const allChecked = Array.from(allItemCheckboxes).every(cb => cb.checked);
        masterCheckbox.checked = allChecked;
    };

    return { init };
})();

// 초기화
document.addEventListener('DOMContentLoaded', cartSelection.init);
