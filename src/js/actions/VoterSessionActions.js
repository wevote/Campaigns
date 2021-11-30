import Dispatcher from '../common/dispatcher/Dispatcher';
import Cookies from '../utils/js-cookie/Cookies';
import AppObservableStore from '../stores/AppObservableStore';
import { stringContains } from '../utils/textFormat';

export default {
  voterSignOut () {  // To discuss - having Store/Actions vs. voterSignOut as a function
    AppObservableStore.setShowSignInModal(false);
    AppObservableStore.unsetStoreSignInStartFullUrl();
    Dispatcher.loadEndpoint('voterSignOut', { sign_out_all_devices: false });
    Cookies.remove('voter_device_id');
    Cookies.remove('voter_device_id', { path: '/' });
    Cookies.remove('voter_device_id', { path: '/', domain: 'wevote.us' });
    Cookies.remove('ballot_has_been_visited');
    Cookies.remove('ballot_has_been_visited', { path: '/' });
    Cookies.remove('location_guess_closed');
    Cookies.remove('location_guess_closed', { path: '/' });
    Cookies.remove('location_guess_closed', { path: '/', domain: 'wevote.us' });
    Cookies.remove('show_full_navigation');
    Cookies.remove('show_full_navigation', { path: '/' });
    Cookies.remove('sign_in_start_full_url', { path: '/' });
    Cookies.remove('sign_in_start_full_url', { path: '/', domain: 'wevote.us' });
  },

  setVoterDeviceIdCookie (id) {
    let { hostname } = window.location;
    hostname = hostname || '';
    console.log('VoterSessionActions setVoterDeviceIdCookie hostname:', hostname);
    if (hostname && stringContains('wevote.us', hostname)) {
      // If hanging off We Vote subdomain, store the cookie with top level domain
      Cookies.set('voter_device_id', id, { expires: 10000, path: '/', domain: 'wevote.us' });
    } else {
      Cookies.set('voter_device_id', id, { expires: 10000, path: '/' });
    }
  },
};
