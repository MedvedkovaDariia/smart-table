import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from './data/dataset_1.js';

import { initData } from './data.js';
import { processFormData } from './lib/utils.js';

import { initTable } from './components/table.js';

// + добавлено: импорт модуля пагинации
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    // + добавлено: приведение типов для пагинации
    const rowsPerPage = parseInt(state.rowsPerPage, 10);
    const page = parseInt(state.page ?? 1, 10);

    // + добавлено: возвращаем расширенный объект
    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();             // состояние полей из таблицы
    let result = [...data];                 // копируем для последующего изменения

    // + добавлено: применение пагинации
    result = applySearching(result, state, action);
    result = applyFiltering(result,state,action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);
    
    sampleTable.render(result);
}

// Создаём экземпляр таблицы с подключением шаблона пагинации
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search','header','filter'],
    after: ['pagination']   // + добавлено: подключаем пагинацию
}, render);

// + добавлено: инициализация модуля пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,        // элементы управления из шаблона pagination
    (el, page, isCurrent) => {              // колбэк для заполнения кнопок страниц
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([        // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {    // передаём элементы фильтра
    searchBySeller: indexes.sellers                                    // для элемента с именем searchBySeller устанавливаем массив продавцов
});

const applySearching = initSearching('search'); 

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Первый рендер (без действия)
render();

