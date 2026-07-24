export function initSearching(searchField) {
   return (query, state, action) => {
        // Если в поле поиска что-то введено, добавляем параметр search
        if (state[searchField] && state[searchField].trim() !== '') {
            return Object.assign({}, query, {
                search: state[searchField]
            });
        }
        return query;
    };
}