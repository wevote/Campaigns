import Dispatcher from '../dispatcher/Dispatcher';

export default {
  clearSearchResults () {
    Dispatcher.dispatch({ type: 'clearSearchResults', payload: true });
  },

  // search_scope_list
  // PN = POLITICIAN_NAME
  searchAll (textFromSearchField, searchScopeList = []) {
    Dispatcher.loadEndpoint('searchAll',
      {
        search_scope_list: searchScopeList,
        text_from_search_field: textFromSearchField,
      });
  },
};
