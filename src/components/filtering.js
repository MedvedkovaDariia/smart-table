export function initFiltering(elements) {
    /**
     * Заполняет select'ы опциями из индексов
     * @param {Object} elements - объект с DOM-элементами фильтров (такой же, как передан при инициализации)
     * @param {Object} indexes - объект с индексами (например, { searchBySeller: {1: "Иван", 2: "Пётр"} })
     */
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            if (!select) return;

            // Очищаем select перед добавлением новых опций
            select.innerHTML = '';
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Все';
            select.appendChild(emptyOption);

            // Добавляем опции из индекса
            Object.values(indexes[elementName]).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        });
    };

    const applyFiltering = (query, state, action) => {
        // Обработка очистки поля
        if (action && action.name === 'clear') {
            const parent = action.closest('.filter-group') || action.parentElement;
            if (parent) {
                const input = parent.querySelector('input, select');
                if (input) {
                    input.value = '';
                }
            }
        }

        // Сбор значений из всех полей фильтра
        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (!el) return;

            if (['INPUT', 'SELECT'].includes(el.tagName) && el.value && el.value.trim() !== '') {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}