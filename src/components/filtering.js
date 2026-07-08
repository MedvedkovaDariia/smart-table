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
            const parent = action.closest('.filter-group') || action.parentElement;
            if (parent) {
                const input = parent.querySelector('input, select');
                if (input) {
                    input.value = '';
                    const fieldName = action.dataset.field;
                    if (fieldName && state[fieldName] !== undefined) {
                        state[fieldName] = '';
                    }
                }
            }
        }
   // ---------- Преобразование числовых полей для диапазонного сравнения ----------
        const processedState = { ...state };

        // Обработка totalFrom (минимальная сумма) и totalTo (максимальная)
        let from = null;
        let to = null;

        // Если есть totalFrom, парсим его
        if (processedState.totalFrom !== undefined && processedState.totalFrom !== '') {
            const fromNum = parseFloat(processedState.totalFrom);
            if (!isNaN(fromNum)) from = fromNum;
        }

        // Если есть totalTo, парсим его
        if (processedState.totalTo !== undefined && processedState.totalTo !== '') {
            const toNum = parseFloat(processedState.totalTo);
            if (!isNaN(toNum)) to = toNum;
        }

        // Если задана хотя бы одна граница, создаём поле total с массивом
        if (from !== null || to !== null) {
            processedState.total = [from, to];
        }

        // Удаляем исходные поля, чтобы они не мешали
        delete processedState.totalFrom;
        delete processedState.totalTo;

        // @todo: #4.3 — настроить компаратор
        const compare = createComparison(defaultRules);

        // @todo: #4.5 — отфильтровать данные
        return data.filter(row => compare(row, processedState));

        // ---------- @todo: #4.3 — настроить компаратор ----------
        //const compare = createComparison(defaultRules);

        // ---------- @todo: #4.5 — отфильтровать данные используя компаратор ----------
       // return data.filter(row => compare(row, state));
    };
}