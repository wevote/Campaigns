import { Subject } from 'rxjs';
import VoterActions from '../actions/VoterActions';   // eslint-disable-line import/no-cycle
import webAppConfig from '../config';
import $ajax from '../utils/service';
import { stringContains } from '../utils/textFormat';
import { isCordova } from '../utils/cordovaUtils';
import VoterStore from './VoterStore';

const subject = new Subject();

export const messageService = {
  sendMessage: (message) => subject.next({ text: message }),
  clearMessages: () => subject.next(),
  getMessage: () => subject.asObservable(),
};

const nonFluxState = {
  blockCampaignXRedirectOnSignIn: false, // When signing in from the header, don't mark a campaign as supported
  campaignListFirstRetrieveInitiated: false,
  chosenPreventSharingOpinions: false,
  chosenReadyIntroductionText: '',
  chosenReadyIntroductionTitle: '',
  chosenSiteLogoUrl: '',
  chosenWebsiteName: '',
  currentPathname: '',
  getVoterGuideSettingsDashboardEditMode: '',
  hideWeVoteLogo: false,
  hostname: '',
  observableUpdateCounter: 0,
  recommendedCampaignListFirstRetrieveInitiated: false,
  scrolledDown: false,
  shareModalStep: '',
  sharedItemCode: '',
  showAdviserIntroModal: false,
  showCompleteYourProfileModal: false,
  showEditAddressButton: false,
  showHeader: 0,
  showHowItWorksModal: false,
  showPaidAccountUpgradeModal: false,
  showPersonalizedScoreIntroModal: false,
  showShareModal: false,
  showSharedItemModal: false,
  showSignInModal: false,
  siteConfigurationHasBeenRetrieved: false,
  siteOwnerOrganizationWeVoteId: '',
  storeSignInStartFullUrl: false,
  voterExternalIdHasBeenSavedOnce: {}, // Dict with externalVoterId and membershipOrganizationWeVoteId as keys, and true/false as value
  voterFirstRetrieveInitiated: false,
};


export default {
  // getNonFluxState () {
  //   return nonFluxState;
  // },

  blockCampaignXRedirectOnSignIn () {
    return nonFluxState.blockCampaignXRedirectOnSignIn;
  },

  calculateUrlSettings (incomingHostname) {
    let hostname = incomingHostname;
    let onChosenFullDomainUrl = false;
    let onFacebookSupportedDomainUrl = false;
    let onWeVoteRootUrl = false;
    let onWeVoteSubdomainUrl = false;

    if (isCordova()) {
      hostname = webAppConfig.WE_VOTE_HOSTNAME;
    }

    // console.log('calculateUrlSettings hostname:', hostname);
    if (hostname === 'wevote.us' || hostname === 'campaigns.wevote.us' || hostname === 'quality.wevote.us' || hostname === 'localhost') {
      onWeVoteRootUrl = true;
    } else if (stringContains('wevote.us', hostname)) {
      onWeVoteSubdomainUrl = true;
    } else {
      onChosenFullDomainUrl = true;
    }
    if (hostname === 'wevote.us' || hostname === 'quality.wevote.us' || hostname === 'localhost' || isCordova()) {
      // We should move this to the server if we can't change the Facebook sign in root url
      onFacebookSupportedDomainUrl = true;
    }
    return { onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl, onWeVoteRootUrl };
  },

  campaignListFirstRetrieveInitiated () {
    return nonFluxState.campaignListFirstRetrieveInitiated;
  },

  setBlockCampaignXRedirectOnSignIn (value) {
    nonFluxState.blockCampaignXRedirectOnSignIn = value;
    messageService.sendMessage('state updated blockCampaignXRedirectOnSignIn');
  },

  setCampaignListFirstRetrieveInitiated (value) {
    nonFluxState.campaignListFirstRetrieveInitiated = value;
    messageService.sendMessage('state updated campaignListFirstRetrieveInitiated');
  },

  setCurrentPathname (currentPathname) {
    nonFluxState.currentPathname = currentPathname;
    messageService.sendMessage('state updated currentPathname');
  },

  setEvaluateHeaderDisplay () {
    // Force the Header to evaluate whether it should display
    nonFluxState.showHeader = Date.now();
    messageService.sendMessage('state updated showHeader');
  },

  setRecommendedCampaignListFirstRetrieveInitiated (value) {
    nonFluxState.recommendedCampaignListFirstRetrieveInitiated = value;
    messageService.sendMessage('state updated recommendedCampaignListFirstRetrieveInitiated');
  },

  setScrolled (scrolledDown) {
    nonFluxState.scrolledDown = scrolledDown;
    messageService.sendMessage('state updated scrolledDown');
  },

  setShareModalStep (step) {
    // console.log('setShareModalStep, step:', step);
    nonFluxState.shareModalStep = step;
    messageService.sendMessage('state updated shareModalStep');
  },

  setShowAdviserIntroModal (show) {
    nonFluxState.showAdviserIntroModal = show;
    messageService.sendMessage('state updated showAdviserIntroModal');
  },

  setShowCompleteYourProfileModal (show) {
    nonFluxState.showCompleteYourProfileModal = show;
    messageService.sendMessage('state updated showCompleteYourProfileModal');
  },

  setShowEditAddressButton (show) {
    nonFluxState.showEditAddressButton = show;
    messageService.sendMessage('state updated showEditAddressButton');
  },

  setShowHowItWorksModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    nonFluxState.showHowItWorksModal = show;
    messageService.sendMessage('state updated showHowItWorksModal');
  },

  setShowImageUploadModal (show) {
    // console.log('Setting image upload modal to open!');
    nonFluxState.showImageUploadModal = show;
    messageService.sendMessage('state updated showImageUploadModal');
  },

  setShowPaidAccountUpgradeModal (chosenPaidAccount) {
    // The chosenPaidAccount values are: free, professional, enterprise
    nonFluxState.showPaidAccountUpgradeModal = chosenPaidAccount;
    messageService.sendMessage('state updated showPaidAccountUpgradeModal');
  },

  setShowPersonalizedScoreIntroModal (show) {
    nonFluxState.showPersonalizedScoreIntroModal = show;
    messageService.sendMessage('state updated showPersonalizedScoreIntroModal');
  },

  setShowShareModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    nonFluxState.showShareModal = show;
    messageService.sendMessage('state updated showShareModal');
  },

  setShowSharedItemModal (sharedItemCode) {
    nonFluxState.sharedItemCode = sharedItemCode;
    nonFluxState.showSharedItemModal = Boolean(sharedItemCode);
    messageService.sendMessage('state updated showSharedItemModal');
  },

  setShowSignInModal (show) {
    nonFluxState.showSignInModal = show;
    messageService.sendMessage('state updated showSignInModal');
  },

  setVoterFirstRetrieveInitiated (voterFirstRetrieveInitiated) {
    nonFluxState.voterFirstRetrieveInitiated = voterFirstRetrieveInitiated;
    messageService.sendMessage('state updated voterFirstRetrieveInitiated');
  },

  setVoterGuideSettingsDashboardEditMode (getVoterGuideSettingsDashboardEditMode) {
    nonFluxState.getVoterGuideSettingsDashboardEditMode = getVoterGuideSettingsDashboardEditMode;
    messageService.sendMessage('state updated getVoterGuideSettingsDashboardEditMode');
  },

  setVoterBallotItemsRetrieveHasBeenCalled (voterBallotItemsRetrieveHasBeenCalled) {
    nonFluxState.voterBallotItemsRetrieveHasBeenCalled = voterBallotItemsRetrieveHasBeenCalled;
    messageService.sendMessage('state updated voterBallotItemsRetrieveHasBeenCalled');
  },

  setStoreSignInStartFullUrl () {
    nonFluxState.storeSignInStartFullUrl = true;
    messageService.sendMessage('state updated storeSignInStartFullUrl');
  },

  unsetStoreSignInStartFullUrl () {
    nonFluxState.unsetStoreSignInStartFullUrl = false;
    messageService.sendMessage('state updated unsetStoreSignInStartFullUrl');
  },

  getChosenAboutOrganizationExternalUrl () {
    return nonFluxState.chosenAboutOrganizationExternalUrl;
  },

  getChosenPreventSharingOpinions () {
    return nonFluxState.chosenPreventSharingOpinions;
  },

  getChosenReadyIntroductionText () {
    return nonFluxState.chosenReadyIntroductionText;
  },

  getChosenReadyIntroductionTitle () {
    return nonFluxState.chosenReadyIntroductionTitle;
  },

  getChosenSiteLogoUrl () {
    return nonFluxState.chosenSiteLogoUrl;
  },

  getChosenWebsiteName () {
    return nonFluxState.chosenWebsiteName || 'WeVote.US Campaigns';
  },

  getCurrentPathname () {
    return nonFluxState.currentPathname;
  },

  getHideWeVoteLogo () {
    return nonFluxState.hideWeVoteLogo;
  },

  getHostname () {
    return nonFluxState.hostname || '';
  },

  getScrolledDown () {
    return nonFluxState.scrolledDown;
  },

  getSharedItemCode () {
    return nonFluxState.sharedItemCode;
  },

  getShareModalStep () {
    // console.log('AppObservableStore shareModalStep:', nonFluxState.shareModalStep);
    return nonFluxState.shareModalStep;
  },

  getSiteOwnerOrganizationWeVoteId () {
    return nonFluxState.siteOwnerOrganizationWeVoteId;
  },

  getVoterGuideSettingsDashboardEditMode () {
    return nonFluxState.getVoterGuideSettingsDashboardEditMode;
  },

  inPrivateLabelMode () {
    return Boolean(nonFluxState.chosenSiteLogoUrl || false);
  },

  isOnWeVoteRootUrl () {
    let onWeVoteRootUrl = nonFluxState.onWeVoteRootUrl || false;
    if (onWeVoteRootUrl === undefined) {
      // onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl,
      const { hostname } = window.location;
      ({ onWeVoteRootUrl } = this.calculateUrlSettings(hostname));
    }
    return onWeVoteRootUrl || isCordova() || stringContains('localhost:', window.location.href);
  },

  isOnWeVoteSubdomainUrl () {
    let onWeVoteSubdomainUrl = nonFluxState.onWeVoteSubdomainUrl || false;
    if (onWeVoteSubdomainUrl === undefined) {
      // onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl,
      const { hostname } = window.location;
      ({ onWeVoteSubdomainUrl } = this.calculateUrlSettings(hostname));
    }
    return onWeVoteSubdomainUrl;
  },

  isOnPartnerUrl () {
    return nonFluxState.onWeVoteSubdomainUrl || nonFluxState.onChosenFullDomainUrl;
  },

  isVoterAdminForThisUrl (linkedOrganizationWeVoteId) {
    // const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    return nonFluxState.siteOwnerOrganizationWeVoteId === linkedOrganizationWeVoteId;
  },

  isOnFacebookSupportedDomainUrl () {
    return nonFluxState.onFacebookSupportedDomainUrl;
  },

  isOnChosenFullDomainUrl () {
    return nonFluxState.onChosenFullDomainUrl;
  },

  recommendedCampaignListFirstRetrieveInitiated () {
    return nonFluxState.recommendedCampaignListFirstRetrieveInitiated;
  },

  showAdviserIntroModal () {
    return nonFluxState.showAdviserIntroModal;
  },

  showCompleteYourProfileModal () {
    return nonFluxState.showCompleteYourProfileModal;
  },

  showEditAddressButton () {
    return nonFluxState.showEditAddressButton;
  },

  showHowItWorksModal () {
    return nonFluxState.showHowItWorksModal;
  },

  showingOneCompleteYourProfileModal () {
    return nonFluxState.showAdviserIntroModal ||
      nonFluxState.showHowItWorksModal ||
      nonFluxState.showPersonalizedScoreIntroModal ||
      nonFluxState.showSharedItemModal;
  },

  showPaidAccountUpgradeModal () {
    // The chosenPaidAccount values are: free, professional, enterprise
    return nonFluxState.showPaidAccountUpgradeModal;
  },

  showPersonalizedScoreIntroModal () {
    return nonFluxState.showPersonalizedScoreIntroModal;
  },

  showShareModal () {
    return nonFluxState.showShareModal;
  },

  showSharedItemModal () {
    return nonFluxState.showSharedItemModal;
  },

  showSignInModal () {
    return nonFluxState.showSignInModal;
  },

  showImageUploadModal () {
    return nonFluxState.showImageUploadModal;
  },

  siteConfigurationHasBeenRetrieved () {
    let { hostname } = window.location;
    hostname = hostname || '';
    if (hostname === 'campaigns.wevote.us') {
      // Bypass for default site
      return true;
    } else {
      return nonFluxState.siteConfigurationHasBeenRetrieved;
    }
  },

  siteConfigurationRetrieve (hostname, refresh_string = '') {
    $ajax({
      endpoint: 'siteConfigurationRetrieve',
      data: { hostname, refresh_string },
      success: (res) => {
        // console.log('AppObservableStore siteConfigurationRetrieve success, res:', res);
        const {
          status: apiStatus,
          success: apiSuccess,
          hostname: hostFromApi,
          organization_we_vote_id: siteOwnerOrganizationWeVoteId,
          chosen_about_organization_external_url: chosenAboutOrganizationExternalUrl,
          chosen_hide_we_vote_logo: hideWeVoteLogo,
          chosen_logo_url_https: chosenSiteLogoUrl,
          chosen_prevent_sharing_opinions: chosenPreventSharingOpinions,
          chosen_ready_introduction_text: chosenReadyIntroductionText,
          chosen_ready_introduction_title: chosenReadyIntroductionTitle,
          chosen_website_name: chosenWebsiteName,
        } = res;
        if (apiSuccess) {
          const { onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl, onWeVoteRootUrl } = this.calculateUrlSettings(hostFromApi);
          const externalVoterId = VoterStore.getExternalVoterId();

          // console.log('AppObservableStore externalVoterId:', externalVoterId, ', siteOwnerOrganizationWeVoteId:', siteOwnerOrganizationWeVoteId);
          const { voterExternalIdHasBeenSavedOnce } = nonFluxState;
          if (externalVoterId && siteOwnerOrganizationWeVoteId) {
            if (!this.voterExternalIdHasBeenSavedOnce(externalVoterId, siteOwnerOrganizationWeVoteId)) {
              // console.log('voterExternalIdHasBeenSavedOnce has NOT been saved before.');
              VoterActions.voterExternalIdSave(externalVoterId, siteOwnerOrganizationWeVoteId);
              if (!voterExternalIdHasBeenSavedOnce[externalVoterId]) {
                voterExternalIdHasBeenSavedOnce[externalVoterId] = {};
              }
              voterExternalIdHasBeenSavedOnce[externalVoterId][siteOwnerOrganizationWeVoteId] = true;
              // AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
            } else {
              // console.log('voterExternalIdHasBeenSavedOnce has been saved before.');
            }
          }
          nonFluxState.apiStatus = apiStatus;
          nonFluxState.apiSuccess = apiSuccess;
          nonFluxState.chosenAboutOrganizationExternalUrl = chosenAboutOrganizationExternalUrl;
          nonFluxState.chosenPreventSharingOpinions = chosenPreventSharingOpinions;
          nonFluxState.chosenReadyIntroductionText = chosenReadyIntroductionText;
          nonFluxState.chosenReadyIntroductionTitle = chosenReadyIntroductionTitle;
          nonFluxState.chosenSiteLogoUrl = chosenSiteLogoUrl;
          nonFluxState.chosenWebsiteName = chosenWebsiteName;
          nonFluxState.hideWeVoteLogo = hideWeVoteLogo;
          nonFluxState.hostname = hostname;
          nonFluxState.onChosenFullDomainUrl = onChosenFullDomainUrl;
          nonFluxState.onFacebookSupportedDomainUrl = onFacebookSupportedDomainUrl;
          nonFluxState.onWeVoteSubdomainUrl = onWeVoteSubdomainUrl;
          nonFluxState.onWeVoteRootUrl = onWeVoteRootUrl;
          nonFluxState.siteConfigurationHasBeenRetrieved = true;
          nonFluxState.siteOwnerOrganizationWeVoteId = siteOwnerOrganizationWeVoteId;
          nonFluxState.voterExternalIdHasBeenSavedOnce = voterExternalIdHasBeenSavedOnce;
          messageService.sendMessage('state updated for siteConfigurationRetrieve');
        }
      },

      error: (res) => {
        console.error('AppObservableStore error: ', res);
      },
    });
  },

  storeSignInStartFullUrl () {
    return nonFluxState.storeSignInStartFullUrl;
  },

  voterBallotItemsRetrieveHasBeenCalled () {
    return nonFluxState.voterBallotItemsRetrieveHasBeenCalled;
  },

  voterCanStartCampaignXForThisPrivateLabelSite () {
    const canEditCampaignXOwnedByOrganizationList = VoterStore.getCanEditCampaignXOwnedByOrganizationList();
    return canEditCampaignXOwnedByOrganizationList.includes(nonFluxState.siteOwnerOrganizationWeVoteId);
  },

  voterExternalIdHasBeenSavedOnce (externalVoterId, membershipOrganizationWeVoteId) {
    if (nonFluxState.voterExternalIdHasBeenSavedOnce[externalVoterId]) {
      return nonFluxState.voterExternalIdHasBeenSavedOnce[externalVoterId][membershipOrganizationWeVoteId] || false;
    } else {
      return false;
    }
  },

  voterFirstRetrieveInitiated () {
    return nonFluxState.voterFirstRetrieveInitiated;
  },

  voterIsAdminForThisUrl () {
    const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    return nonFluxState.siteOwnerOrganizationWeVoteId === linkedOrganizationWeVoteId;
  },
};