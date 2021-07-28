import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/AppDispatcher';
import VoterActions from '../actions/VoterActions'; // eslint-disable-line import/no-cycle
import VoterStore from './VoterStore'; // eslint-disable-line import/no-cycle
import webAppConfig from '../config'; // eslint-disable-line import/no-cycle
import { isCordova } from '../utils/cordovaUtils'; // eslint-disable-line import/no-cycle
import { stringContains } from '../utils/textFormat';

/**
 * AppStore allows you to store state information, in situations where there is no API call needed
 */
class AppStore extends ReduceStore {
  getInitialState () {
    return {
      activityTidbitWeVoteIdForDrawer: '',
      blockCampaignXRedirectOnSignIn: false, // When signing in from the header, don't mark a campaign as supported
      campaignFirstRetrieveInitiated: false,
      campaignListFirstRetrieveInitiated: false,
      chosenPreventSharingOpinions: false,
      chosenReadyIntroductionText: '',
      chosenReadyIntroductionTitle: '',
      chosenSiteLogoUrl: '',
      chosenWebsiteName: '',
      getVoterGuideSettingsDashboardEditMode: '',
      getStartedMode: '',
      hideWeVoteLogo: false,
      hostname: '',
      organizationModalBallotItemWeVoteId: '',
      recommendedCampaignListFirstRetrieveInitiated: false,
      scrolledDown: false,
      sharedItemCode: '',
      shareModalStep: '',
      showActivityTidbitDrawer: false,
      showAdviserIntroModal: false,
      showCompleteYourProfileModal: false,
      showEditAddressButton: false,
      showElectionsWithOrganizationVoterGuidesModal: false,
      showHowItWorksModal: false,
      showNewVoterGuideModal: false,
      showOrganizationModal: false,
      showPaidAccountUpgradeModal: false,
      showPersonalizedScoreIntroModal: false,
      showSelectBallotModal: false,
      showSelectBallotModalHideAddress: false,
      showSelectBallotModalHideElections: false,
      showShareModal: false,
      showSharedItemModal: false,
      showSignInModal: false,
      showVoterPlanModal: false,
      siteConfigurationHasBeenRetrieved: false,
      siteOwnerOrganizationWeVoteId: '',
      storeSignInStartFullUrl: false,
      viewingOrganizationVoterGuide: false,
      voterExternalIdHasBeenSavedOnce: {}, // Dict with externalVoterId and membershipOrganizationWeVoteId as keys, and true/false as value
      voterFirstRetrieveInitiated: false,
    };
  }

  activityTidbitWeVoteIdForDrawer () {
    return this.getState().activityTidbitWeVoteIdForDrawer;
  }

  blockCampaignXRedirectOnSignIn () {
    return this.getState().blockCampaignXRedirectOnSignIn;
  }

  campaignFirstRetrieveInitiated () {
    return this.getState().campaignFirstRetrieveInitiated;
  }

  campaignListFirstRetrieveInitiated () {
    return this.getState().campaignListFirstRetrieveInitiated;
  }

  getChosenAboutOrganizationExternalUrl () {
    return this.getState().chosenAboutOrganizationExternalUrl;
  }

  getChosenPreventSharingOpinions () {
    return this.getState().chosenPreventSharingOpinions;
  }

  getChosenReadyIntroductionText () {
    return this.getState().chosenReadyIntroductionText;
  }

  getChosenReadyIntroductionTitle () {
    return this.getState().chosenReadyIntroductionTitle;
  }

  getChosenSiteLogoUrl () {
    return this.getState().chosenSiteLogoUrl;
  }

  getChosenWebsiteName () {
    return this.getState().chosenWebsiteName || 'WeVote.US Campaigns';
  }

  getHideWeVoteLogo () {
    return this.getState().hideWeVoteLogo;
  }

  getHostname () {
    const { hostname } = window.location;
    return this.getState().hostname || hostname;
  }

  getScrolledDown () {
    return this.getState().scrolledDown;
  }

  getSharedItemCode () {
    return this.getState().sharedItemCode;
  }

  getSiteOwnerOrganizationWeVoteId () {
    return this.getState().siteOwnerOrganizationWeVoteId;
  }

  getStartedMode () {
    return this.getState().getStartedMode;
  }

  getViewingOrganizationVoterGuide () {
    return this.getState().viewingOrganizationVoterGuide;
  }

  getVoterGuideSettingsDashboardEditMode () {
    return this.getState().getVoterGuideSettingsDashboardEditMode;
  }

  inPrivateLabelMode () {
    return Boolean(this.getState().chosenSiteLogoUrl || false);
  }

  isOnWeVoteRootUrl () {
    console.log('AppStore onWeVoteRootUrl before:', this.getState().onWeVoteRootUrl);
    let { onWeVoteRootUrl } = this.getState();
    if (onWeVoteRootUrl === undefined) {
      // onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl,
      const { hostname } = window.location;
      ({ onWeVoteRootUrl } = this.calculateUrlSettings(hostname));
      console.log('AppStore onWeVoteRootUrl was undefined:', onWeVoteRootUrl);
    }
    return onWeVoteRootUrl || isCordova() || stringContains('localhost:', window.location.href);
  }

  isOnWeVoteSubdomainUrl () {
    console.log('AppStore onWeVoteSubdomainUrl before:', this.getState().onWeVoteSubdomainUrl);
    let { onWeVoteSubdomainUrl } = this.getState();
    if (onWeVoteSubdomainUrl === undefined) {
      // onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl,
      const { hostname } = window.location;
      ({ onWeVoteSubdomainUrl } = this.calculateUrlSettings(hostname));
      console.log('AppStore onWeVoteSubdomainUrl was undefined:', onWeVoteSubdomainUrl);
    }
    return onWeVoteSubdomainUrl;
  }

  isOnPartnerUrl () {
    return this.getState().onWeVoteSubdomainUrl || this.getState().onChosenFullDomainUrl;
  }

  voterIsAdminForThisUrl () {
    const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    return this.getState().siteOwnerOrganizationWeVoteId === linkedOrganizationWeVoteId;
  }

  isOnFacebookSupportedDomainUrl () {
    /* hack for Campaign */
    // return this.getState().onFacebookSupportedDomainUrl;
    return true;
  }

  isOnChosenFullDomainUrl () {
    return this.getState().onChosenFullDomainUrl;
  }

  recommendedCampaignListFirstRetrieveInitiated () {
    return this.getState().recommendedCampaignListFirstRetrieveInitiated;
  }

  showingOneCompleteYourProfileModal () {
    return this.getState().showAdviserIntroModal ||
      this.getState().showFirstPositionIntroModal ||
      this.getState().showHowItWorksModal ||
      this.getState().showPersonalizedScoreIntroModal ||
      this.getState().showSelectBallotModal ||
      this.getState().showSharedItemModal ||
      this.getState().showValuesIntroModal;
  }

  showActivityTidbitDrawer () {
    return this.getState().showActivityTidbitDrawer;
  }

  showAdviserIntroModal () {
    return this.getState().showAdviserIntroModal;
  }

  showCompleteYourProfileModal () {
    return this.getState().showCompleteYourProfileModal;
  }

  showEditAddressButton () {
    return this.getState().showEditAddressButton;
  }

  showElectionsWithOrganizationVoterGuidesModal () {
    return this.getState().showElectionsWithOrganizationVoterGuidesModal;
  }

  showFirstPositionIntroModal () {
    return this.getState().showFirstPositionIntroModal;
  }

  showHowItWorksModal () {
    return this.getState().showHowItWorksModal;
  }

  showVoterPlanModal () {
    return this.getState().showVoterPlanModal;
  }

  showNewVoterGuideModal () {
    return this.getState().showNewVoterGuideModal;
  }

  showPaidAccountUpgradeModal () {
    // The chosenPaidAccount values are: free, professional, enterprise
    return this.getState().showPaidAccountUpgradeModal;
  }

  showPersonalizedScoreIntroModal () {
    return this.getState().showPersonalizedScoreIntroModal;
  }

  showShareModal () {
    return this.getState().showShareModal;
  }

  showSharedItemModal () {
    return this.getState().showSharedItemModal;
  }

  shareModalStep () {
    // console.log('AppStore shareModalStep:', this.getState().shareModalStep);
    return this.getState().shareModalStep;
  }

  showSelectBallotModal () {
    return this.getState().showSelectBallotModal;
  }

  showSelectBallotModalHideAddress () {
    return this.getState().showSelectBallotModalHideAddress;
  }

  showSelectBallotModalHideElections () {
    return this.getState().showSelectBallotModalHideElections;
  }

  showSignInModal () {
    return this.getState().showSignInModal;
  }

  organizationModalBallotItemWeVoteId () {
    return this.getState().organizationModalBallotItemWeVoteId;
  }

  showOrganizationModal () {
    return this.getState().showOrganizationModal;
  }

  showValuesIntroModal () {
    return this.getState().showValuesIntroModal;
  }

  showImageUploadModal () {
    return this.getState().showImageUploadModal;
  }

  siteConfigurationHasBeenRetrieved () {
    let { hostname } = window.location;
    hostname = hostname || '';
    if (hostname === 'campaigns.wevote.us') {
      // Bypass for default site
      return true;
    } else {
      return this.getState().siteConfigurationHasBeenRetrieved;
    }
  }

  storeSignInStartFullUrl () {
    return this.getState().storeSignInStartFullUrl;
  }

  voterExternalIdHasBeenSavedOnce (externalVoterId, membershipOrganizationWeVoteId) {
    if (this.getState().voterExternalIdHasBeenSavedOnce[externalVoterId]) {
      return this.getState().voterExternalIdHasBeenSavedOnce[externalVoterId][membershipOrganizationWeVoteId] || false;
    } else {
      return false;
    }
  }

  voterFirstRetrieveInitiated () {
    return this.getState().voterFirstRetrieveInitiated;
  }

  calculateUrlSettings (incomingHostname) {
    let hostname = incomingHostname;
    let onChosenFullDomainUrl = false;
    let onFacebookSupportedDomainUrl = false;
    let onWeVoteRootUrl = false;
    let onWeVoteSubdomainUrl = false;

    if (isCordova()) {
      hostname = webAppConfig.WE_VOTE_HOSTNAME;
    }

    console.log('calculateUrlSettings hostname:', hostname);
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
  }

  reduce (state, action) {
    let apiStatus;
    let apiSuccess;
    let chosenAboutOrganizationExternalUrl;
    let chosenPreventSharingOpinions;
    let chosenReadyIntroductionText;
    let chosenReadyIntroductionTitle;
    let chosenSiteLogoUrl;
    let chosenWebsiteName;
    let externalVoterId;
    let hideWeVoteLogo;
    let hostname;
    let siteOwnerOrganizationWeVoteId;
    let voterExternalIdHasBeenSavedOnce;
    switch (action.type) {
      case 'activityTidbitWeVoteIdForDrawer':
        return { ...state, activityTidbitWeVoteIdForDrawer: action.payload };
      case 'activityTidbitWeVoteIdForDrawerAndOpen':
        return {
          ...state,
          activityTidbitWeVoteIdForDrawer: action.payload,
          showActivityTidbitDrawer: true,
        };
      case 'blockCampaignXRedirectOnSignIn':
        return { ...state, blockCampaignXRedirectOnSignIn: action.payload };
      case 'campaignFirstRetrieveInitiated':
        return { ...state, campaignFirstRetrieveInitiated: action.payload };
      case 'campaignListFirstRetrieveInitiated':
        return { ...state, campaignListFirstRetrieveInitiated: action.payload };
      case 'getStartedMode':
        return { ...state, getStartedMode: action.payload };
      case 'getVoterGuideSettingsDashboardEditMode':
        return { ...state, getVoterGuideSettingsDashboardEditMode: action.payload };
      case 'organizationModalBallotItemWeVoteId':
        return { ...state, organizationModalBallotItemWeVoteId: action.payload };
      case 'recommendedCampaignListFirstRetrieveInitiated':
        return { ...state, recommendedCampaignListFirstRetrieveInitiated: action.payload };
      case 'scrolledDown':
        return { ...state, scrolledDown: action.payload };
      case 'showActivityTidbitDrawer':
        return { ...state, showActivityTidbitDrawer: action.payload };
      case 'showAdviserIntroModal':
        return { ...state, showAdviserIntroModal: action.payload };
      case 'showCompleteYourProfileModal':
        // console.log('showCompleteYourProfileModal show:', action.payload);
        return { ...state, showCompleteYourProfileModal: action.payload };
      case 'showEditAddressButton':
        return { ...state, showEditAddressButton: action.payload };
      case 'showElectionsWithOrganizationVoterGuidesModal':
        return { ...state, showElectionsWithOrganizationVoterGuidesModal: action.payload };
      case 'showFirstPositionIntroModal':
        return { ...state, showFirstPositionIntroModal: action.payload };
      case 'showHowItWorksModal':
        return { ...state, showHowItWorksModal: action.payload };
      case 'showVoterPlanModal':
        return { ...state, showVoterPlanModal: action.payload };
      case 'showNewVoterGuideModal':
        return { ...state, showNewVoterGuideModal: action.payload };
      case 'showPaidAccountUpgradeModal':
        return { ...state, showPaidAccountUpgradeModal: action.payload };
      case 'showPersonalizedScoreIntroModal':
        return { ...state, showPersonalizedScoreIntroModal: action.payload };
      case 'showShareModal':
        return { ...state, showShareModal: action.payload };
      case 'showSharedItemModal':
        return { ...state, sharedItemCode: action.payload, showSharedItemModal: (action.payload !== '') };
      case 'shareModalStep':
        // console.log('AppStore shareModalStep:', action.payload);
        return { ...state, shareModalStep: action.payload };
      case 'showSelectBallotModal':
        return {
          ...state,
          showSelectBallotModal: action.showSelectBallotModal,
          showSelectBallotModalHideAddress: action.showSelectBallotModalHideAddress,
          showSelectBallotModalHideElections: action.showSelectBallotModalHideElections,
        };
      case 'showSignInModal':
        return { ...state, showSignInModal: action.payload };
      case 'showOrganizationModal':
        return { ...state, showOrganizationModal: action.payload };
      case 'showValuesIntroModal':
        return { ...state, showValuesIntroModal: action.payload };
      case 'showImageUploadModal':
        return { ...state, showImageUploadModal: action.payload };
      case 'siteConfigurationRetrieve':
        ({
          status: apiStatus,
          success: apiSuccess,
          hostname,
          organization_we_vote_id: siteOwnerOrganizationWeVoteId,
          chosen_about_organization_external_url: chosenAboutOrganizationExternalUrl,
          chosen_hide_we_vote_logo: hideWeVoteLogo,
          chosen_logo_url_https: chosenSiteLogoUrl,
          chosen_prevent_sharing_opinions: chosenPreventSharingOpinions,
          chosen_ready_introduction_text: chosenReadyIntroductionText,
          chosen_ready_introduction_title: chosenReadyIntroductionTitle,
          chosen_website_name: chosenWebsiteName,
        } = action.res);
        if (apiSuccess) {
          const { onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl, onWeVoteRootUrl } = this.calculateUrlSettings(hostname);
          externalVoterId = VoterStore.getExternalVoterId();
          // console.log('AppStore externalVoterId:', externalVoterId, ', siteOwnerOrganizationWeVoteId:', siteOwnerOrganizationWeVoteId);
          ({ voterExternalIdHasBeenSavedOnce } = state);
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
          return {
            ...state,
            apiStatus,
            apiSuccess,
            chosenAboutOrganizationExternalUrl,
            chosenPreventSharingOpinions,
            chosenReadyIntroductionText,
            chosenReadyIntroductionTitle,
            chosenSiteLogoUrl,
            chosenWebsiteName,
            hideWeVoteLogo,
            hostname,
            onChosenFullDomainUrl,
            onFacebookSupportedDomainUrl,
            onWeVoteSubdomainUrl,
            onWeVoteRootUrl,
            siteConfigurationHasBeenRetrieved: true,
            siteOwnerOrganizationWeVoteId,
            voterExternalIdHasBeenSavedOnce,
          };
        } else {
          return state;
        }
      case 'storeSignInStartFullUrl':
        // Send a signal to src/js/Application.jsx to write the current pathname to the cookie 'sign_in_start_full_url'
        return { ...state, storeSignInStartFullUrl: action.payload };
      case 'unsetStoreSignInStartFullUrl':
        // Turn off the signal to src/js/Application.jsx to write the current pathname to the cookie 'sign_in_start_full_url'
        return { ...state, storeSignInStartFullUrl: action.payload };
      case 'viewingOrganizationVoterGuide':
        return { ...state, viewingOrganizationVoterGuide: action.payload };
      case 'voterFirstRetrieveInitiated':
        return { ...state, voterFirstRetrieveInitiated: action.payload };
      default:
        return state;
    }
  }
}

export default new AppStore(Dispatcher);
