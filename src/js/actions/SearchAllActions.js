import Dispatcher from '../components/Dispatcher/Dispatcher';

export default {
  clearSearchResults () {
    Dispatcher.dispatch({ type: 'clearSearchResults', payload: true });
  },

  // search_scope_list
  // P = POLITICIAN
  searchAll (textFromSearchField, searchScopeList = []) {
    Dispatcher.loadEndpoint('searchAll',
      {
        search_scope_list: searchScopeList,
        text_from_search_field: textFromSearchField,
      });
  },
};
