import cookies from './cookies';
import AppActions from '../actions/AppActions';

export default function voterSignOut () {
  AppActions.setShowSignInModal(false);
  AppActions.unsetStoreSignInStartFullUrl();
  AppActions.signOutFromManyStores();   // Eleven stores or more, act on this action
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
}
