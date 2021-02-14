import { ReduceStore } from 'flux/utils';
import assign from 'object-assign';
import Dispatcher from '../components/Dispatcher/Dispatcher';

class SearchAllStore extends ReduceStore {
  getInitialState () {
    return {
    };
  }

  getSearchResults () {
    return this.getState().searchResults || [];
  }

  getTextFromSearchField () {
    return this.getState().textFromSearchField || '';
  }

  getForceClosed () {
    return this.getState().forceClosed;
  }

  isSearchInProgress () { // eslint-disable-line
    return true;
    // return this.getState().searchType === "SEARCH_IN_PROGRESS";
  }

  reduce (state, action) { // eslint-disable-line
    switch (action.type) {
      case 'clearSearchResults':
        // console.log('SearchAllStore clearSearchResults');
        return { ...state, searchResults: []};
      case 'exitSearch':
        return assign({}, state, { forceClosed: true });
      case 'searchAll':
        // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
        if (!action.res || !action.res.success) return state;

        return {
          textFromSearchField: action.res.text_from_search_field,
          searchResults: action.res.search_results,
        };

      case 'error-searchAll':
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new SearchAllStore(Dispatcher);
