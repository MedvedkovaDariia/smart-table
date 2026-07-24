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


const api = initData();

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage, 10);
    const page = parseInt(state.page ?? 1, 10);

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
  async function render(action) {
    let state = collectState();             // состояние полей из таблицы
    let query = {};

   query = applySearching(query, state, action);
   query = applyFiltering(query,state,action);
   query = applySorting(query, state, action);
   query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}

// Создаём экземпляр таблицы с подключением шаблона пагинации
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search','header','filter'],
    after: ['pagination']   
}, render);

// + добавлено: инициализация модуля пагинации
const {applyPagination, updatePagination} = initPagination( sampleTable.pagination.elements,        // элементы управления из шаблона pagination
    (el, page, isCurrent) => {              
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }); 

const applySorting = initSorting([        // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);


const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);

const applySearching = initSearching('search'); 

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init(){
    const indexes = await api.getIndexes();
    
  updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
   
}

init().then(render);
