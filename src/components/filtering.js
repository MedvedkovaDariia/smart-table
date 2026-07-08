import { createComparison, defaultRules } from '../lib/compare.js';

export function initFiltering(elements, indexes) {
    // ---------- @todo: #4.1 — заполнить выпадающие списки опциями ----------
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            const options = Object.values(indexes[elementName]).map((name) => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            });
            elements[elementName].append(...options);
        }
    });

    return (data, state, action) => {
        // ---------- @todo: #4.2 — обработать очистку поля ----------
        if (action && action.name === 'clear') {
            // Находим родительский контейнер (например, .filter-group)
            const parent = action.closest('.filter-group') || action.parentElement;
            if (parent) {
                const input = parent.querySelector('input, select');
                if (input) {
                    // Сбрасываем значение поля в DOM
                    input.value = '';
                    // Сбрасываем соответствующее поле в state
                    const fieldName = action.dataset.field;
                    if (fieldName && state[fieldName] !== undefined) {
                        state[fieldName] = '';
                    }
                }
            }
        }

        // ---------- @todo: #4.3 — настроить компаратор ----------
        const compare = createComparison(defaultRules);

        // ---------- @todo: #4.5 — отфильтровать данные используя компаратор ----------
        return data.filter((row) => compare(row, state));
    };
}