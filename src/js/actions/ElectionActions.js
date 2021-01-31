import Dispatcher from '../components/Dispatcher/Dispatcher';

export default {

  electionsRetrieve () {
    Dispatcher.loadEndpoint('electionsRetrieve', {});
  },
};
