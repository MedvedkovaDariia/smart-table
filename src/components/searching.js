import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    // Правила задаются именами (строками), а не функциями
    const customRules = {
        [searchField]: [
            'skipEmptyTargetValues',
            // Для searchMultipleFields нужно передать аргументы
            // Обычно это делается через специальный синтаксис:
            // { name: 'searchMultipleFields', args: [searchField, ['date', 'customer', 'seller'], false] }
            // Но предположим, что createComparison умеет обрабатывать функции как правила,
            // однако ошибка говорит об обратном.
        ]
    };

    // Если createComparison ожидает имена, то нужно зарегистрировать правило searchMultipleFields
    // с аргументами. Это зависит от реализации compare.js.
    // Альтернативно, можно создать компаратор вручную:

    // Простой и надёжный способ — обойтись без createComparison,
    // так как нам нужно только одно поле поиска.
    const searchRule = rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false);

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField];
        // Если поле пустое, пропускаем все строки (не фильтруем)
        if (!searchValue) return data;

        return data.filter(row => {
            // Проверяем, что хотя бы одно из полей содержит searchValue
            const fields = ['date', 'customer', 'seller'];
            return fields.some(field => {
                const val = row[field];
                return val && val.toString().toLowerCase().includes(searchValue.toLowerCase());
            });
        });
    };
}