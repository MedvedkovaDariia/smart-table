export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // ---------- @todo: #3.1 — запомнить выбранный режим сортировки ----------
            // Переключаем состояние нажатой кнопки по карте переходов
            action.dataset.value = sortMap[action.dataset.value];
            // Сохраняем поле и направление из датасета кнопки
            field = action.dataset.field;
            order = action.dataset.value;

            // ---------- @todo: #3.2 — сбросить сортировки остальных колонок ----------
            columns.forEach(column => {
                // Сбрасываем все кнопки, кроме нажатой (сравниваем по ссылке)
                if (column !== action) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // ---------- @todo: #3.3 — получить выбранный режим сортировки ----------
            // Находим активную колонку (у которой data-value не 'none')
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

       const sort = (field && order !== 'none') ? `${field}:${order}` : null; // сохраним в переменную параметр сортировки в виде field:direction

        return sort ? Object.assign({}, query, { sort }) : query; // по общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
    };
}