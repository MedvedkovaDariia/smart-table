import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    // Клонируем шаблон кнопки страницы и очищаем контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    // Храним количество страниц для действия "last"
    let pageCount = 1;

    /**
     * Формирует параметры пагинации для запроса к серверу
     * @param {Object} query - текущие параметры запроса
     * @param {Object} state - состояние формы (содержит rowsPerPage и page)
     * @param {Object} action - действие пользователя (переключение страницы)
     * @returns {Object} новый объект query с добавленными limit и page
     */
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // Обрабатываем действия переключения страниц (если action передан)
        if (action) {
            switch (action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(pageCount, page + 1);
                    break;
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = pageCount;
                    break;
                default:
                    // если действие не связано с пагинацией, ничего не делаем
                    break;
            }
        }

        // Возвращаем новый объект query, добавляя параметры пагинации
        return Object.assign({}, query, {
            limit,
            page
        });
    };

    /**
     * Обновляет интерфейс пагинатора после получения данных с сервера
     * @param {number} total - общее количество записей
     * @param {Object} params - объект с параметрами { limit, page }
     */
    const updatePagination = (total, { limit, page }) => {
        pageCount = Math.ceil(total / limit);

        // Получаем массив видимых страниц (не более 5)
        const visiblePages = getPages(page, pageCount, 5);

        // Отрисовываем кнопки страниц
        pages.replaceChildren(
            ...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNumber, pageNumber === page);
            })
        );

        // Обновляем информацию о диапазоне строк
        const from = (page - 1) * limit + 1;
        const to = Math.min(page * limit, total);
        fromRow.textContent = total === 0 ? 0 : from;
        toRow.textContent = total === 0 ? 0 : to;
        totalRows.textContent = total;
    };

    // Возвращаем две функции
    return {
        applyPagination,
        updatePagination
    };
};