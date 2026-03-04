export const SearchUtil = {
    bindInput(input, clearBtn, defaultView, autocompleteView, onUpdate = null) {
        if (!input) return null;
        const updateView = () => {
            const val = input.value.trim();
            const hasText = val.length > 0;

            if (clearBtn) clearBtn.style.display = hasText ? 'flex' : 'none';

            if (hasText) {
                if (defaultView) defaultView.style.display = 'none';
                if (autocompleteView) autocompleteView.style.display = 'block';
            } else {
                if (defaultView) defaultView.style.display = 'block';
                if (autocompleteView) autocompleteView.style.display = 'none';
            }
            if (onUpdate) onUpdate(hasText);
        };

        input.addEventListener('input', updateView);

        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                input.value = '';
                input.focus();
                updateView();
            });
        }
        return updateView;
    },

    bindRecentSearch(container) {
        if (typeof container === 'string') container = document.querySelector(container);
        if (!container) return;

        const deleteButtons = container.querySelectorAll('.btn-delete-item');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const li = this.closest('li');
                const list = li.closest('.recent-list');
                if (li) li.remove();

                if (list && list.children.length === 0) {
                    let noData = container.querySelector('.no-data');
                    if (!noData) {
                        noData = document.createElement('div');
                        noData.className = 'no-data';
                        noData.textContent = '최근 검색어가 없습니다.';
                        list.parentNode.appendChild(noData);
                        list.remove();
                    } else {
                        noData.style.display = 'block';
                    }
                }
            });
        });

        const deleteAllBtn = container.querySelector('.btn-delete-all');
        if (deleteAllBtn) {
            deleteAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const list = container.querySelector('.recent-list');
                if (list) {
                    let noData = container.querySelector('.no-data');
                    if (!noData) {
                        noData = document.createElement('div');
                        noData.className = 'no-data';
                        noData.textContent = '최근 검색어가 없습니다.';
                        list.parentNode.appendChild(noData);
                        list.remove();
                    } else {
                        list.innerHTML = '';
                        noData.style.display = 'block';
                    }
                }
            });
        }
    }
};
