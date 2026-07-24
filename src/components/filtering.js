export function initFiltering(elements) {
    /**
     * Заполняет select'ы опциями из индексов
     * @param {Object} indexes - объект с индексами (например, { searchBySeller: {1: "Иван", 2: "Пётр"} })
     */
    const updateIndexes = (indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            if (!select) return;

            // Очищаем select перед добавлением новых опций (оставляем только пустой option)
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

    /**
     * Формирует параметры фильтрации для запроса к серверу
     * @param {Object} query - текущие параметры запроса
     * @param {Object} state - состояние формы (не используется напрямую, но может пригодиться для очистки)
     * @param {Object} action - действие пользователя (содержит name и target)
     * @returns {Object} новый объект query с добавленными фильтрами
     */
    const applyFiltering = (query, state, action) => {
        // Обработка очистки поля
        if (action && action.name === 'clear') {
            // Находим родительский элемент с полем ввода
            const parent = action.closest('.filter-group') || action.parentElement;
            if (parent) {
                const input = parent.querySelector('input, select');
                if (input) {
                    input.value = ''; // сбрасываем значение в DOM
                    // (состояние state обновится при следующем collectState)
                }
            }
        }

        // Сбор значений из всех полей фильтра
        const filter = {};
        Object.keys(elements).forEach(key => {
            const el = elements[key];
            if (!el) return;

            // Берём только INPUT и SELECT с непустым значением
            if (['INPUT', 'SELECT'].includes(el.tagName) && el.value && el.value.trim() !== '') {
                filter[`filter[${el.name}]`] = el.value;
            }
        });

        // Если есть фильтры, добавляем их к query (не мутируя исходный)
        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}