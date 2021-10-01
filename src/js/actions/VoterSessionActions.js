import Dispatcher from '../common/dispatcher/Dispatcher';
import cookies from '../utils/cookies';
import AppActions from './AppActions';
import { stringContains } from '../utils/textFormat';

export default {
  voterSignOut () {  // To discuss - having Store/Actions vs. voterSignOut as a function
    AppActions.setShowSignInModal(false);
    AppActions.unsetStoreSignInStartFullUrl();
    Dispatcher.loadEndpoint('voterSignOut', { sign_out_all_devices: false });
    cookies.removeItem('voter_device_id');
    cookies.removeItem('voter_device_id', '/');
    cookies.removeItem('voter_device_id', '/', 'wevote.us');
    cookies.removeItem('ballot_has_been_visited');
    cookies.removeItem('ballot_has_been_visited', '/');
    cookies.removeItem('location_guess_closed');
    cookies.removeItem('location_guess_closed', '/');
    cookies.removeItem('location_guess_closed', '/', 'wevote.us');
    cookies.removeItem('show_full_navigation');
    cookies.removeItem('show_full_navigation', '/');
    cookies.removeItem('sign_in_start_full_url', '/');
    cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
  },

  setVoterDeviceIdCookie (id) {
    let { hostname } = window.location;
    hostname = hostname || '';
    console.log('VoterSessionActions setVoterDeviceIdCookie hostname:', hostname);
    if (hostname && stringContains('wevote.us', hostname)) {
      // If hanging off We Vote subdomain, store the cookie with top level domain
      cookies.setItem('voter_device_id', id, Infinity, '/', 'wevote.us');
    } else {
      cookies.setItem('voter_device_id', id, Infinity, '/');
    }
  },
};
