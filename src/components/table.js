import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
// @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы (массивы before и after)

// Обрабатываем массив before (в обратном порядке для корректного prepend)
if (Array.isArray(before)) {
    // Создаём копию массива, чтобы не мутировать исходный
    const reversedBefore = [...before].reverse();
    reversedBefore.forEach(subName => {
        // Клонируем шаблон по идентификатору
        root[subName] = cloneTemplate(subName);
        // Вставляем перед таблицей
        root.container.prepend(root[subName].container);
    });
}

// Обрабатываем массив after (в прямом порядке)
if (Array.isArray(after)) {
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        // Вставляем после таблицы
        root.container.append(root[subName].container);
    });
}
    // @todo: #1.3 —  обработать события и вызвать onAction()
     root.container.addEventListener('change', () => {
        onAction();
    });

    // 2. Событие reset – сброс формы. Откладываем вызов, чтобы поля успели очиститься
    root.container.addEventListener('reset', () => {
        setTimeout(() => onAction(), 0);
    });

    // 3. Событие submit – отправка формы. Предотвращаем перезагрузку и передаём сабмиттер
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (row.elements && row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
          return row.container;
        });

        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}