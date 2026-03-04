export const CategoryRenderUtil = {
    renderDepth1(menuData, depth1List) {
        if (!depth1List || !menuData) return;
        depth1List.innerHTML = menuData.map(item => `
            <li data-id="${item.id}">
                <a href="${item.link}">${item.name}</a>
            </li>
        `).join('');
    },
    updateDepth2(id, menuData, depth1List, depth2List) {
        if (!menuData || !depth1List || !depth2List) return;
        const data = menuData.find(item => item.id === id);
        if (!data) return;

        depth1List.querySelectorAll('li').forEach(li => {
            li.classList.toggle('active', li.dataset.id === id);
        });

        let html = `<li><a href="${data.link}" class="is-all">${data.name === '전체' ? '전체' : data.name + ' 전체'}</a></li>`;
        if (data.subMenu) {
            html += data.subMenu.map(sub => `
                <li><a href="${sub.link}">${sub.name}</a></li>
            `).join('');
        }
        depth2List.innerHTML = html;
    }
};
