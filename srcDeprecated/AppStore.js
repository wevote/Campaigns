import { ReduceStore } from 'flux/utils';
import Dispatcher from '../src/js/dispatcher/AppDispatcher';
import VoterActions from '../src/js/actions/VoterActions'; // eslint-disable-line import/no-cycle
import VoterStore from '../src/js/stores/VoterStore'; // eslint-disable-line import/no-cycle
import webAppConfig from '../src/js/config'; // eslint-disable-line import/no-cycle
import { isCordova } from '../src/js/common/utils/isCordovaOrWebApp'; // eslint-disable-line import/no-cycle
import stringContains from '../src/js/common/utils/stringContains';

/**
 * AppStore allows you to store state information, in situations where there is no API call needed
 */
class AppStore extends ReduceStore {
  getInitialState () {
    return {
      blockCampaignXRedirectOnSignIn: false, // When signing in from the header, don't mark a campaign as supported
      campaignListFirstRetrieveInitiated: false,
      chosenSiteLogoUrl: '',
      chosenWebsiteName: '',
      getVoterGuideSettingsDashboardEditMode: '',
      hideWeVoteLogo: false,
      hostname: '',
      recommendedCampaignListFirstRetrieveInitiated: false,
      sharedItemCode: '',
      shareModalStep: '',
      showCompleteYourProfileModal: false,
      showShareModal: false,
      showSharedItemModal: false,
      showSignInModal: false,
      siteConfigurationHasBeenRetrieved: false,
      siteOwnerOrganizationWeVoteId: '',
      storeSignInStartFullUrl: false,
      voterExternalIdHasBeenSavedOnce: {}, // Dict with externalVoterId and membershipOrganizationWeVoteId as keys, and true/false as value
      voterFirstRetrieveInitiated: false,
    };
  }

  blockCampaignXRedirectOnSignIn () {
    return this.getState().blockCampaignXRedirectOnSignIn;
  }

  campaignListFirstRetrieveInitiated () {
    return this.getState().campaignListFirstRetrieveInitiated;
  }

  getChosenAboutOrganizationExternalUrl () {
    return this.getState().chosenAboutOrganizationExternalUrl;
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

  getSharedItemCode () {
    return this.getState().sharedItemCode;
  }

  getSiteOwnerOrganizationWeVoteId () {
    return this.getState().siteOwnerOrganizationWeVoteId;
  }

  getVoterGuideSettingsDashboardEditMode () {
    return this.getState().getVoterGuideSettingsDashboardEditMode;
  }

  inPrivateLabelMode () {
    return Boolean(this.getState().chosenSiteLogoUrl || false);
  }

  isOnWeVoteRootUrl () {
    let { onWeVoteRootUrl } = this.getState();
    if (onWeVoteRootUrl === undefined) {
      // onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl,
      const { hostname } = window.location;
      ({ onWeVoteRootUrl } = this.calculateUrlSettings(hostname));
    }
    return onWeVoteRootUrl || isCordova() || stringContains('localhost:', window.location.href);
  }

  isOnWeVoteSubdomainUrl () {
    let { onWeVoteSubdomainUrl } = this.getState();
    if (onWeVoteSubdomainUrl === undefined) {
      // onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl,
      const { hostname } = window.location;
      ({ onWeVoteSubdomainUrl } = this.calculateUrlSettings(hostname));
    }
    return onWeVoteSubdomainUrl;
  }

  isOnPartnerUrl () {
    return this.getState().onWeVoteSubdomainUrl || this.getState().onChosenFullDomainUrl;
  }

  voterCanStartCampaignXForThisPrivateLabelSite () {
    const canEditCampaignXOwnedByOrganizationList = VoterStore.getCanEditCampaignXOwnedByOrganizationList();
    return canEditCampaignXOwnedByOrganizationList.includes(this.getState().siteOwnerOrganizationWeVoteId);
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

  showCompleteYourProfileModal () {
    return this.getState().showCompleteYourProfileModal;
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

  showSignInModal () {
    return this.getState().showSignInModal;
  }

  showValuesIntroModal () {
    return this.getState().showValuesIntroModal;
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
  }

  reduce (state, action) {
    let apiStatus;
    let apiSuccess;
    let chosenAboutOrganizationExternalUrl;
    let chosenSiteLogoUrl;
    let chosenWebsiteName;
    let externalVoterId;
    let hideWeVoteLogo;
    let hostname;
    let siteOwnerOrganizationWeVoteId;
    let voterExternalIdHasBeenSavedOnce;
    switch (action.type) {
      case 'blockCampaignXRedirectOnSignIn':
        return { ...state, blockCampaignXRedirectOnSignIn: action.payload };
      case 'campaignListFirstRetrieveInitiated':
        return { ...state, campaignListFirstRetrieveInitiated: action.payload };
      case 'getVoterGuideSettingsDashboardEditMode':
        return { ...state, getVoterGuideSettingsDashboardEditMode: action.payload };
      case 'recommendedCampaignListFirstRetrieveInitiated':
        return { ...state, recommendedCampaignListFirstRetrieveInitiated: action.payload };
      case 'showCompleteYourProfileModal':
        // console.log('showCompleteYourProfileModal show:', action.payload);
        return { ...state, showCompleteYourProfileModal: action.payload };
      case 'showShareModal':
        return { ...state, showShareModal: action.payload };
      case 'showSharedItemModal':
        return { ...state, sharedItemCode: action.payload, showSharedItemModal: (action.payload !== '') };
      case 'shareModalStep':
        // console.log('AppStore shareModalStep:', action.payload);
        return { ...state, shareModalStep: action.payload };
      case 'showSignInModal':
        return { ...state, showSignInModal: action.payload };
      case 'showValuesIntroModal':
        return { ...state, showValuesIntroModal: action.payload };
      case 'siteConfigurationRetrieve':
        ({
          status: apiStatus,
          success: apiSuccess,
          hostname,
          organization_we_vote_id: siteOwnerOrganizationWeVoteId,
          chosen_about_organization_external_url: chosenAboutOrganizationExternalUrl,
          chosen_hide_we_vote_logo: hideWeVoteLogo,
          chosen_logo_url_https: chosenSiteLogoUrl,
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
      case 'voterFirstRetrieveInitiated':
        return { ...state, voterFirstRetrieveInitiated: action.payload };
      default:
        return state;
    }
  }
}

export default new AppStore(Dispatcher);
