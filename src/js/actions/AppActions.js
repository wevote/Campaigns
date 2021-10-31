import Dispatcher from '../dispatcher/AppDispatcher';
import DispatcherLoadEndpoint from '../common/dispatcher/Dispatcher';


export default {
  setBlockCampaignXRedirectOnSignIn (value) {
    Dispatcher.dispatch({ type: 'blockCampaignXRedirectOnSignIn', payload: value });
  },

  setCampaignListFirstRetrieveInitiated (value) {
    Dispatcher.dispatch({ type: 'campaignListFirstRetrieveInitiated', payload: value });
  },

  setRecommendedCampaignListFirstRetrieveInitiated (value) {
    Dispatcher.dispatch({ type: 'recommendedCampaignListFirstRetrieveInitiated', payload: value });
  },

  setVoterGuideSettingsDashboardEditMode (getVoterGuideSettingsDashboardEditMode) {
    Dispatcher.dispatch({ type: 'getVoterGuideSettingsDashboardEditMode', payload: getVoterGuideSettingsDashboardEditMode });
  },

  setShareModalStep (step) {
    // console.log('setShareModalStep, step:', step);
    Dispatcher.dispatch({ type: 'shareModalStep', payload: step });
  },

  setShowCompleteYourProfileModal (show) {
    Dispatcher.dispatch({ type: 'showCompleteYourProfileModal', payload: show });
  },

  setShowShareModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    Dispatcher.dispatch({ type: 'showShareModal', payload: show });
  },

  setShowSharedItemModal (sharedItemCode) {
    Dispatcher.dispatch({ type: 'showSharedItemModal', payload: sharedItemCode });
  },

  setShowSignInModal (show) {
    Dispatcher.dispatch({ type: 'showSignInModal', payload: show });
  },

  setShowValuesIntroModal (show) {
    Dispatcher.dispatch({ type: 'showValuesIntroModal', payload: show });
  },

  setVoterFirstRetrieveInitiated (value) {
    Dispatcher.dispatch({ type: 'voterFirstRetrieveInitiated', payload: value });
  },

  signOutFromManyStores () {
    DispatcherLoadEndpoint.loadEndpoint('voterSignOut', { sign_out_all_devices: false });
  },

  siteConfigurationRetrieve (hostname, refresh_string = '') {
    Dispatcher.loadEndpoint('siteConfigurationRetrieve',
      {
        hostname,
        refresh_string,
      });
  },

  storeSignInStartFullUrl () {
    Dispatcher.dispatch({ type: 'storeSignInStartFullUrl', payload: true });
  },

  unsetStoreSignInStartFullUrl () {
    Dispatcher.dispatch({ type: 'unsetStoreSignInStartFullUrl', payload: false });
  },
};
