export const DataLoader = {
    _categoryData: null,
    async getCategoryMenu() {
        if (this._categoryData) return this._categoryData;
        try {
            const response = await fetch('/eclub/assets/data/category-menu.json');
            if (!response.ok) throw new Error('Network response was not ok');
            this._categoryData = await response.json();
            return this._categoryData;
        } catch (error) {
            console.error('카테고리 메뉴 데이터를 불러오는 중 오류 발생:', error);
            return null;
        }
    }
};
