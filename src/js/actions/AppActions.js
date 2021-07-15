import Dispatcher from '../components/Dispatcher/AppDispatcher';
import DispatcherLoadEndpoint from '../components/Dispatcher/Dispatcher';


export default {
  setActivityTidbitWeVoteIdForDrawer (activityTidbitWeVoteId) {
    Dispatcher.dispatch({ type: 'activityTidbitWeVoteIdForDrawer', payload: activityTidbitWeVoteId });
  },

  setActivityTidbitWeVoteIdForDrawerAndOpen (activityTidbitWeVoteId) {
    Dispatcher.dispatch({ type: 'activityTidbitWeVoteIdForDrawerAndOpen', payload: activityTidbitWeVoteId });
  },

  setBlockCampaignXRedirectOnSignIn (value) {
    Dispatcher.dispatch({ type: 'blockCampaignXRedirectOnSignIn', payload: value });
  },

  setCampaignFirstRetrieveInitiated (value) {
    Dispatcher.dispatch({ type: 'campaignFirstRetrieveInitiated', payload: value });
  },

  setCampaignListFirstRetrieveInitiated (value) {
    Dispatcher.dispatch({ type: 'campaignListFirstRetrieveInitiated', payload: value });
  },

  setGetStartedMode (getStartedMode) {
    Dispatcher.dispatch({ type: 'getStartedMode', payload: getStartedMode });
  },

  setOrganizationModalBallotItemWeVoteId (ballotItemWeVoteId) {
    Dispatcher.dispatch({ type: 'organizationModalBallotItemWeVoteId', payload: ballotItemWeVoteId });
  },

  setRecommendedCampaignListFirstRetrieveInitiated (value) {
    Dispatcher.dispatch({ type: 'recommendedCampaignListFirstRetrieveInitiated', payload: value });
  },

  setVoterGuideSettingsDashboardEditMode (getVoterGuideSettingsDashboardEditMode) {
    Dispatcher.dispatch({ type: 'getVoterGuideSettingsDashboardEditMode', payload: getVoterGuideSettingsDashboardEditMode });
  },

  setScrolled (scrolledDown) {
    Dispatcher.dispatch({ type: 'scrolledDown', payload: scrolledDown });
  },

  setShareModalStep (step) {
    // console.log('setShareModalStep, step:', step);
    Dispatcher.dispatch({ type: 'shareModalStep', payload: step });
  },

  setShowActivityTidbitDrawer (show) {
    Dispatcher.dispatch({ type: 'showActivityTidbitDrawer', payload: show });
  },

  setShowAdviserIntroModal (show) {
    Dispatcher.dispatch({ type: 'showAdviserIntroModal', payload: show });
  },

  setShowCompleteYourProfileModal (show) {
    Dispatcher.dispatch({ type: 'showCompleteYourProfileModal', payload: show });
  },

  setShowEditAddressButton (show) {
    Dispatcher.dispatch({ type: 'showEditAddressButton', payload: show });
  },

  setShowFirstPositionIntroModal (show) {
    Dispatcher.dispatch({ type: 'showFirstPositionIntroModal', payload: show });
  },

  setShowHowItWorksModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    Dispatcher.dispatch({ type: 'showHowItWorksModal', payload: show });
  },

  setShowVoterPlanModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    Dispatcher.dispatch({ type: 'showVoterPlanModal', payload: show });
  },

  setShowNewVoterGuideModal (show) {
    Dispatcher.dispatch({ type: 'showNewVoterGuideModal', payload: show });
  },

  setShowElectionsWithOrganizationVoterGuidesModal (show) {
    Dispatcher.dispatch({ type: 'showElectionsWithOrganizationVoterGuidesModal', payload: show });
  },

  setShowPaidAccountUpgradeModal (chosenPaidAccount) {
    // The chosenPaidAccount values are: free, professional, enterprise
    Dispatcher.dispatch({ type: 'showPaidAccountUpgradeModal', payload: chosenPaidAccount });
  },

  setShowPersonalizedScoreIntroModal (show) {
    Dispatcher.dispatch({ type: 'showPersonalizedScoreIntroModal', payload: show });
  },

  setShowSelectBallotModal (showSelectBallotModal, showSelectBallotModalHideAddress = false, showSelectBallotModalHideElections = false) {
    Dispatcher.dispatch({ type: 'showSelectBallotModal', showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections });
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

  setShowOrganizationModal (show) {
    // console.log("Setting organizationModal to ", show);
    Dispatcher.dispatch({ type: 'showOrganizationModal', payload: show });
  },

  setShowValuesIntroModal (show) {
    Dispatcher.dispatch({ type: 'showValuesIntroModal', payload: show });
  },

  setShowImageUploadModal (show) {
    console.log('Setting image upload modal to open!');
    Dispatcher.dispatch({ type: 'showImageUploadModal', payload: show });
  },

  setViewingOrganizationVoterGuide (isViewing) {
    Dispatcher.dispatch({ type: 'viewingOrganizationVoterGuide', payload: isViewing });
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
