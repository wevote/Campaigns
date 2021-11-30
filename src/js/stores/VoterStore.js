import { ReduceStore } from 'flux/utils';
import Cookies from '../utils/js-cookie/Cookies';
import Dispatcher from '../common/dispatcher/Dispatcher';
import { stringContains } from '../utils/textFormat';


class VoterStore extends ReduceStore {
  getInitialState () {
    return {
      voter: {
        interface_status_flags: 0,
        state_code_from_ip_address: '',
        needsVoterRetrieve: false,
      },
      address: {},
      canEditCampaignXOwnedByOrganizationList: [],
      emailAddressStatus: {},
      emailSignInStatus: {},
      emailAddressList: [],
      externalVoterId: '',
      facebookSignInStatus: {},
      facebookPhotoRetrieveLoopCount: 0,
      latestGoogleCivicElectionId: 0,
      secretCodeVerificationStatus: {
        incorrectSecretCodeEntered: false,
        numberOfTriesRemaining: 5,
        secretCodeVerified: false,
        voterMustRequestNewCode: false,
        voterSecretCodeRequestsLocked: false,
      },
      smsPhoneNumberStatus: {},
      smsPhoneNumberList: [],
      voterContactEmailGoogleCount: 0,
      voterContactEmailList: [],
      voterEmailQueuedToSave: '',
      voterEmailQueuedToSaveSet: false,
      voterFirstNameQueuedToSave: '',
      voterFirstNameQueuedToSaveSet: false,
      voterFirstRetrieveCompleted: false, // Has the first retrieve of the voter completed?
      voterFound: false,
      voterExternalIdHasBeenSavedOnce: {}, // Dict with externalVoterId and membershipOrganizationWeVoteId as keys, and true/false as value
      voterLastNameQueuedToSave: '',
      voterLastNameQueuedToSaveSet: false,
      voterNotificationSettingsUpdateStatus: {
        apiResponseReceived: false,
        emailFound: false,
        voterFound: false,
        normalizedEmailAddress: '',
        normalizedSmsPhoneNumber: '',
        notificationSettingsFlags: false,
      },
      voterPhotoQueuedToSave: '',
      voterPhotoQueuedToSaveSet: false,
      voterPhotoTooBig: false,
    };
  }

  resetState () {
    return this.getInitialState();
  }

  getVoter () {
    return this.getState().voter;
  }

  getVoterEmail () {
    return this.getState().voter.email || '';
  }

  getVoterFirstName () {
    if (this.getState().voter) {
      return this.getState().voter.first_name || '';
    }
    return '';
  }

  getVoterWeVoteId () {
    return this.getState().voter.we_vote_id || '';
  }

  electionId () {
    return this.getState().latestGoogleCivicElectionId || 0;
  }

  getTextForMapSearch () {
    return this.getState().address.text_for_map_search || '';
  }

  getVoterContactEmailGoogleCount () {
    return this.getState().voterContactEmailGoogleCount || 0;
  }

  getVoterContactEmailList () {
    return this.getState().voterContactEmailList || [];
  }

  getVoterSavedAddress () {
    // console.log('VoterStore, getVoterSavedAddress: ', this.getState().address.voter_entered_address);
    return this.getState().address.voter_entered_address || false;
  }

  getVoterStateCode () {
    // TODO in getVoterStateCode we check for normalized_state in the address object. We should be
    //  capturing the state when we call Google address Auto Complete (search for _placeChanged)
    //  and we should also figure out the state_code when we call API server voterAddressSave and put it in the "address"
    //  return data.
    // console.log('this.getState().address:', this.getState().address);
    // console.log('this.getState().voter:', this.getState().voter);
    if (this.getState().address && this.getState().address.normalized_state) {
      // console.log('normalized_state:', this.getState().address.normalized_state);
      return this.getState().address.normalized_state;
    }
    if (this.getState().voter && this.getState().voter.state_code_from_ip_address) {
      // console.log('state_code_from_ip_address:', this.getState().voter.state_code_from_ip_address);
      return this.getState().voter.state_code_from_ip_address;
    }
    return '';
  }

  getAddressObject () {
    return this.getState().address || {};
  }

  getBallotLocationForVoter () {
    // console.log("getBallotLocationForVoter this.getState().address:", this.getState().address);
    if (this.getState().address) {
      return {
        text_for_map_search: this.getState().address.text_for_map_search,
        ballot_returned_we_vote_id: this.getState().address.ballot_returned_we_vote_id,
        polling_location_we_vote_id: '',
        ballot_location_order: 0,
        ballot_location_display_name: this.getState().address.ballot_location_display_name,
        ballot_location_shortcut: '',
        google_civic_election_id: this.getState().address.google_civic_election_id,
        voter_entered_address: this.getState().address.voter_entered_address || false, // Did the voter save an address?
        voter_specific_ballot_from_google_civic: this.getState().address.voter_specific_ballot_from_google_civic || false, // Did this ballot come back for this specific address?
      };
    }
    return null;
  }

  getEmailAddressList () {
    const { emailAddressList } = this.getState();
    return emailAddressList;
  }

  getPrimaryEmailAddressDict () {
    const { emailAddressList } = this.getState();
    let oneEmail = {};
    let primaryEmailAddress = {};
    for (let i = 0; i < emailAddressList.length; ++i) {
      oneEmail = emailAddressList[i];
      // console.log('getPrimaryEmailAddressDict, oneEmail:', oneEmail);
      if (oneEmail.primary_email_address === true &&
          oneEmail.email_permanent_bounce === false &&
          oneEmail.email_ownership_is_verified === true) {
        primaryEmailAddress = oneEmail;
      }
    }
    // console.log('getPrimaryEmailAddressDict, primaryEmailAddress:', primaryEmailAddress);
    return primaryEmailAddress;
  }

  getEmailAddressesVerifiedCount () {
    const { emailAddressList } = this.getState();
    let oneEmail = {};
    let verifiedCount = 0;
    for (let i = 0; i < emailAddressList.length; ++i) {
      oneEmail = emailAddressList[i];
      if (oneEmail.email_ownership_is_verified === true) {
        verifiedCount += 1;
      }
    }
    return verifiedCount;
  }

  getEmailAddressStatus () {
    return this.getState().emailAddressStatus;
  }

  getEmailSignInStatus () {
    return this.getState().emailSignInStatus;
  }

  getExternalVoterId () {
    return this.getState().externalVoterId;
  }

  getFacebookPhoto () {
    return this.getState().voter.facebook_profile_image_url_https || '';
  }

  getFacebookSignInStatus () {
    return this.getState().facebookSignInStatus;
  }

  getFirstName () {
    return this.getState().voter.first_name || '';
  }

  getLastName () {
    return this.getState().voter.last_name || '';
  }

  getFirstPlusLastName () {
    const storedFirstName = this.getFirstName();
    const storedLastName = this.getLastName();
    let displayName = '';
    if (storedFirstName && String(storedFirstName) !== '') {
      displayName = storedFirstName;
      if (storedLastName && String(storedLastName) !== '') {
        displayName += ' ';
      }
    }
    if (storedLastName && String(storedLastName) !== '') {
      displayName += storedLastName;
    }
    return displayName;
  }

  getFullName () {
    return this.getState().voter.full_name || '';
  }

  getLinkedOrganizationWeVoteId () {
    return this.getState().voter.linked_organization_we_vote_id || '';
  }

  getSMSPhoneNumberStatus () {
    return this.getState().smsPhoneNumberStatus;
  }

  getSMSPhoneNumberList () {
    const { smsPhoneNumberList } = this.getState();
    return smsPhoneNumberList;
  }

  getSMSPhoneNumbersVerifiedCount () {
    const { smsPhoneNumberList } = this.getState();
    let onePhoneNumber = {};
    let verifiedCount = 0;
    for (let i = 0; i < smsPhoneNumberList.length; ++i) {
      onePhoneNumber = smsPhoneNumberList[i];
      if (onePhoneNumber.sms_ownership_is_verified === true) {
        verifiedCount += 1;
      }
    }
    return verifiedCount;
  }

  getStateCodeFromIPAddress () {
    return this.getState().voter.state_code_from_ip_address || '';
  }

  getTwitterHandle () {
    return this.getState().voter.twitter_handle || '';
  }

  getTwitterSignInStatus () {
    return this.getState().twitterSignInStatus || {};
  }

  getCanEditCampaignXOwnedByOrganizationList () {
    return this.getState().canEditCampaignXOwnedByOrganizationList || [];
  }

  getVoterEmailQueuedToSave () {
    return this.getState().voterEmailQueuedToSave;
  }

  getVoterEmailQueuedToSaveSet () {
    return this.getState().voterEmailQueuedToSaveSet;
  }

  getVoterFirstNameQueuedToSave () {
    return this.getState().voterFirstNameQueuedToSave;
  }

  getVoterFirstNameQueuedToSaveSet () {
    return this.getState().voterFirstNameQueuedToSaveSet;
  }

  getVoterLastNameQueuedToSave () {
    return this.getState().voterLastNameQueuedToSave;
  }

  getVoterLastNameQueuedToSaveSet () {
    return this.getState().voterLastNameQueuedToSaveSet;
  }

  getVoterIsSignedIn () {
    return this.getState().voter.is_signed_in || false;
  }

  getVoterIsSignedInWithEmail () {
    return this.getState().voter.signed_in_with_email || false;
  }

  getVoterNotificationSettingsUpdateStatus () {
    return this.getState().voterNotificationSettingsUpdateStatus || {};
  }

  getVoterPhotoQueuedToSave () {
    return this.getState().voterPhotoQueuedToSave;
  }

  getVoterPhotoQueuedToSaveSet () {
    return this.getState().voterPhotoQueuedToSaveSet;
  }

  getVoterPhotoTooBig () {
    return this.getState().voterPhotoTooBig || false;
  }

  // Could be either Facebook photo or Twitter photo
  getVoterPhotoUrlLarge () {
    return this.getState().voter.voter_photo_url_large || '';
  }

  // Could be either Facebook photo or Twitter photo
  getVoterPhotoUrlMedium () {
    return this.getState().voter.voter_photo_url_medium || '';
  }

  // Could be either Facebook photo or Twitter photo
  getVoterPhotoUrlTiny () {
    return this.getState().voter.voter_photo_url_tiny || '';
  }

  getVoterProfileUploadedImageUrlLarge () {
    return this.getState().voter.we_vote_hosted_profile_uploaded_image_url_large || '';
  }

  getSecretCodeVerificationStatus () {
    return this.getState().secretCodeVerificationStatus || {};
  }

  voterDeviceId () {
    return this.getState().voter.voter_device_id || Cookies.get('voter_device_id');
  }

  setVoterDeviceIdCookie (id) { // eslint-disable-line
    Cookies.remove('voter_device_id');
    Cookies.remove('voter_device_id', { path: '/' });
    let { hostname } = window.location;
    hostname = hostname || '';
    // console.log('setVoterDeviceIdCookie hostname:', hostname);
    if (hostname && stringContains('wevote.us', hostname)) {
      Cookies.set('voter_device_id', id, Infinity, '/', 'wevote.us');
    } else {
      Cookies.set('voter_device_id', id, Infinity, '/');
    }
  }

  // Airbnb doesnt like bitwise operators in JavaScript
  getInterfaceFlagState (flag) {
    // Look in js/Constants/VoterConstants.js for list of flag constant definitions
    // console.log("VoterStore getInterfaceFlagState flag: ", flag);
    if (!this.getState().voter) {
      return false;
    }

    const interfaceStatusFlags = this.getState().voter.interface_status_flags || 0;
    // console.log("VoterStore getInterfaceFlagState interfaceStatusFlags: ", interfaceStatusFlags);
    // return True if bit specified by the flag is also set in interfaceStatusFlags (voter.interface_status_flags)
    // Eg: if interfaceStatusFlags = 5, then we can confirm that bits representing 1 and 4 are set (i.e., 0101)
    // so for value of flag = 1 and 4, we return a positive integer,
    // but, the bit representing 2 and 8 are not set, so for flag = 2 and 8, we return zero
    // const flagIsSet = interfaceStatusFlags & flag;  // eslint-disable-line no-bitwise
    // console.log("VoterStore getInterfaceFlagState flagIsSet: ", flagIsSet);
    return interfaceStatusFlags & flag;  // eslint-disable-line no-bitwise
  }

  getNotificationSettingsFlagState (flag) {
    // Look in js/Constants/VoterConstants.js for list of flag constant definitions
    if (!this.getState().voter) {
      return false;
    }
    const notificationSettingsFlags = this.getState().voter.notification_settings_flags || 0;
    // return True if bit specified by the flag is also set
    //  in notificationSettingsFlags (voter.notification_settings_flags)
    // Eg: if interfaceStatusFlags = 5, then we can confirm that bits representing 1 and 4 are set (i.e., 0101)
    // so for value of flag = 1 and 4, we return a positive integer,
    // but, the bit representing 2 and 8 are not set, so for flag = 2 and 8, we return zero
    return notificationSettingsFlags & flag; // eslint-disable-line no-bitwise
  }

  getNotificationSettingsFlagStateFromSecretKey (flag) {
    // Look in js/Constants/VoterConstants.js for list of flag constant definitions
    if (!this.getState().voterNotificationSettingsUpdateStatus) {
      return false;
    }
    const { notificationSettingsFlags } = this.getState().voterNotificationSettingsUpdateStatus;
    // return True if bit specified by the flag is also set
    //  in notificationSettingsFlags (voter.notification_settings_flags)
    // Eg: if interfaceStatusFlags = 5, then we can confirm that bits representing 1 and 4 are set (i.e., 0101)
    // so for value of flag = 1 and 4, we return a positive integer,
    // but, the bit representing 2 and 8 are not set, so for flag = 2 and 8, we return zero
    return notificationSettingsFlags & flag; // eslint-disable-line no-bitwise
  }

  isVoterFound () {
    return this.getState().voterFound;
  }

  voterExternalIdHasBeenSavedOnce (externalVoterId, membershipOrganizationWeVoteId) {
    if (!externalVoterId || !membershipOrganizationWeVoteId) {
      return false;
    }
    if (this.getState().voterExternalIdHasBeenSavedOnce[externalVoterId]) {
      return this.getState().voterExternalIdHasBeenSavedOnce[externalVoterId][membershipOrganizationWeVoteId] || false;
    } else {
      return false;
    }
  }

  voterFirstRetrieveCompleted () {
    return this.getState().voterFirstRetrieveCompleted;
  }

  reduce (state, action) {
    let facebookPhotoRetrieveLoopCount;
    let address;
    let canEditCampaignXOwnedByOrganizationList;
    let currentVoterDeviceId;
    // const delayBeforeApiCall = 3000;
    // let externalVoterId;
    let googleCivicElectionId;
    let incomingVoter;
    let incorrectSecretCodeEntered;
    // let membershipOrganizationWeVoteId;
    let numberOfTriesRemaining;
    let revisedState;
    let secretCodeVerified;
    let voterDeviceId;
    // let voterExternalIdHasBeenSavedOnce;
    let voterFirstRetrieveCompleted;
    let voterMustRequestNewCode;
    let voterSecretCodeRequestsLocked;

    // console.log('VoterStore reduce action', action.type);
    switch (action.type) {
      case 'clearEmailAddressStatus':
        // console.log('VoterStore clearEmailAddressStatus');
        return { ...state, emailAddressStatus: {} };
      case 'clearSecretCodeVerificationStatus':
        // console.log('VoterStore clearSecretCodeVerificationStatus');
        return {
          ...state,
          secretCodeVerificationStatus: {
            incorrectSecretCodeEntered: false,
            numberOfTriesRemaining: 5,
            secretCodeVerified: false,
            voterMustRequestNewCode: false,
            voterSecretCodeRequestsLocked: false,
          },
        };
      case 'clearSMSPhoneNumberStatus':
        // console.log('VoterStore clearSMSPhoneNumberStatus');
        return { ...state, smsPhoneNumberStatus: {} };
        // case 'organizationSave':
        //   // console.log('VoterStore organizationSave');
        //   // If an organization saves, we want to check to see if it is tied to this voter. If so,
        //   // refresh the voter data so we have the value linked_organization_we_vote_id in the voter object.
        //   if (action.res.success) {
        //     if (action.res.facebook_id === state.voter.facebook_id) {
        //       >No application code in stores!<  VoterActions.voterRetrieve();
        //     } else {
        //       const organizationTwitterHandle = action.res.organization_twitter_handle || '';
        //       const twitterScreenName = state.voter.twitter_screen_name !== undefined ? state.voter.twitter_screen_name : '';
        //       if (organizationTwitterHandle && organizationTwitterHandle.toLowerCase() === twitterScreenName.toLowerCase()) {
        //         >No application code in stores!<   VoterActions.voterRetrieve();
        //       }
        //     }
        //   }
        //   return state;

        // case 'organizationSuggestionTasks':
        //   // console.log('VoterStore organizationSuggestionTasks');
        //   if (action.res.success) {
        //     if (action.res.kind_of_follow_task === 'FOLLOW_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW') {
        //       // console.log("organizationSuggestionTasks FOLLOW_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW");
        //       // >No application code in stores!<   VoterGuideActions.voterGuidesToFollowRetrieve(this.electionId());
        //       >No application code in stores!<   VoterGuideActions.voterGuidesFollowedRetrieve(this.electionId());
        //     } else if (action.res.kind_of_suggestion_task === 'UPDATE_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW') {
        //       // console.log("organizationSuggestionTasks UPDATE_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW");
        //       // >No application code in stores!<   VoterGuideActions.voterGuidesToFollowRetrieve(this.electionId());
        //       >No application code in stores!<   VoterGuideActions.voterGuidesFollowedRetrieve(this.electionId());
        //     }
        //   }
        //   return state;

      case 'positionListForVoter':
        // console.log('VoterStore positionListForVoter');
        if (action.res.show_only_this_election) {
          const positionListForOneElection = action.res.position_list;
          return {
            ...state,
            voter: {
              ...state.voter,
              positionListForOneElection,
            },
          };
        } else if (action.res.show_all_other_elections) {
          const positionListForAllExceptOneElection = action.res.position_list;
          return {
            ...state,
            voter: {
              ...state.voter,
              positionListForAllExceptOneElection,
            },
          };
        } else {
          const positionList = action.res.position_list;
          return {
            ...state,
            voter: {
              ...state.voter,
              positionList,
            },
          };
        }

        // case 'setExternalVoterId':
        //   externalVoterId = action.payload;
        //   membershipOrganizationWeVoteId = AppObservableStore.getSiteOwnerOrganizationWeVoteId();
        //   ({ voterExternalIdHasBeenSavedOnce } = state);
        //   // console.log('VoterStore externalVoterId:', externalVoterId, ', membershipOrganizationWeVoteId:', membershipOrganizationWeVoteId);
        //   if (externalVoterId && membershipOrganizationWeVoteId) {
        //     if (!this.voterExternalIdHasBeenSavedOnce(externalVoterId, membershipOrganizationWeVoteId)) {
        //       // console.log('voterExternalIdHasBeenSavedOnce has NOT been saved before.');
        //       >No application code in stores!< VoterActions.voterExternalIdSave(externalVoterId, membershipOrganizationWeVoteId);
        //       if (!voterExternalIdHasBeenSavedOnce[externalVoterId]) {
        //         voterExternalIdHasBeenSavedOnce[externalVoterId] = {};
        //       }
        //       voterExternalIdHasBeenSavedOnce[externalVoterId][membershipOrganizationWeVoteId] = true;
        //       // >No application code in stores!<   AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
        //     } else {
        //       // console.log('voterExternalIdHasBeenSavedOnce has been saved before.');
        //     }
        //   }
        //   return {
        //     ...state,
        //     externalVoterId,
        //     voterExternalIdHasBeenSavedOnce,
        //   };

      case 'twitterRetrieveIdsIFollow':
        // console.log('VoterStore twitterRetrieveIdsIFollow');
        // if (action.res.success) {
        //   >No application code in stores!<   VoterActions.organizationSuggestionTasks('UPDATE_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW',
        //     'FOLLOW_SUGGESTIONS_FROM_TWITTER_IDS_I_FOLLOW');
        // }

        return state;

      case 'voterAnalysisForJumpProcess':
        // console.log('VoterStore, voterAnalysisForJumpProcess');
        // >No application code in stores!<   VoterActions.voterRetrieve();
        return {
          ...state,
          emailAddressStatus: {
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_verify_attempted: action.res.email_verify_attempted,
            email_address_found: action.res.email_address_found,
          },
          emailSignInStatus: {
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_sign_in_attempted: action.res.email_verify_attempted,
            email_address_found: action.res.email_address_found,
          },
        };

      case 'voterAddressRetrieve':
        // console.log('VoterStore, voterAddressRetrieve, address:', action.res);
        address = action.res || {};
        return {
          ...state,
          address,
        };

      case 'voterAddressSave':
        // console.log('VoterStore, voterAddressSave, action.res:', action.res);
        // if (action.res.status === 'SIMPLE_ADDRESS_SAVE') {
        //   // Don't do any other refreshing
        // } else {
        //   >No application code in stores!<   BallotActions.voterBallotItemsRetrieve();
        // }
        ({ address } = action.res);
        if (!address) {
          address = {
            text_for_map_search: '',
            google_civic_election_id: 0,
            ballot_returned_we_vote_id: '',
            ballot_location_display_name: '',
            voter_entered_address: '',
            voter_specific_ballot_from_google_civic: null,
          };
        }

        return {
          ...state,
          address: {
            text_for_map_search: address.text_for_map_search,
            google_civic_election_id: address.google_civic_election_id,
            ballot_returned_we_vote_id: address.ballot_returned_we_vote_id,
            ballot_location_display_name: address.ballot_location_display_name,
            voter_entered_address: address.voter_entered_address,
            voter_specific_ballot_from_google_civic: address.voter_specific_ballot_from_google_civic,
          },
        };

      case 'voterBallotItemsRetrieve':
        // console.log("VoterStore voterBallotItemsRetrieve latestGoogleCivicElectionId: ", action.res.google_civic_election_id);
        googleCivicElectionId = action.res.google_civic_election_id || 0;
        if (googleCivicElectionId !== 0) {
          return {
            ...state,
            latestGoogleCivicElectionId: googleCivicElectionId,
          };
        }

        return state;

      case 'voterEmailAddressRetrieve':
        // console.log("VoterStore  voterEmailAddressRetrieve: ", action.res.email_address_list);
        return {
          ...state,
          emailAddressList: action.res.email_address_list,
        };

      case 'voterEmailAddressSave':
        // console.log('VoterStore, voterEmailAddressSave');
        // >No application code in stores!<   VoterActions.voterRetrieve();
        return {
          ...state,
          emailAddressList: action.res.email_address_list,
          emailAddressStatus: {
            email_verify_attempted: action.res.email_verify_attempted,
            email_address_already_owned_by_other_voter: action.res.email_address_already_owned_by_other_voter,
            email_address_already_owned_by_this_voter: action.res.email_address_already_owned_by_this_voter,
            email_address_created: action.res.email_address_created,
            email_address_deleted: action.res.email_address_deleted,
            email_address_not_valid: action.res.email_address_not_valid,
            link_to_sign_in_email_sent: action.res.link_to_sign_in_email_sent,
            make_primary_email: action.res.make_primary_email,
            sign_in_code_email_sent: action.res.sign_in_code_email_sent,
            secret_code_system_locked_for_this_voter_device_id: action.res.secret_code_system_locked_for_this_voter_device_id,
            verification_email_sent: action.res.verification_email_sent,
          },
        };

      case 'voterEmailAddressSignIn':
        // console.log('VoterStore, voterEmailAddressSignIn');
        // >No application code in stores!<   VoterActions.voterRetrieve();
        return {
          ...state,
          emailSignInStatus: {
            email_sign_in_attempted: action.res.email_sign_in_attempted,
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_address_found: action.res.email_address_found,
            yes_please_merge_accounts: action.res.yes_please_merge_accounts,
            voter_we_vote_id_from_secret_key: action.res.voter_we_vote_id_from_secret_key,
            voter_merge_two_accounts_attempted: false,
          },
        };

      case 'voterEmailAddressVerify':
        // console.log('VoterStore, voterEmailAddressVerify');
        // >No application code in stores!<   VoterActions.voterRetrieve();
        return {
          ...state,
          emailAddressStatus: {
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_verify_attempted: action.res.email_verify_attempted,
            email_address_found: action.res.email_address_found,
          },
          emailSignInStatus: {
            email_ownership_is_verified: action.res.email_ownership_is_verified,
            email_secret_key_belongs_to_this_voter: action.res.email_secret_key_belongs_to_this_voter,
            email_sign_in_attempted: action.res.email_verify_attempted,
            email_address_found: action.res.email_address_found,
          },
        };

      case 'voterFacebookSaveToCurrentAccount':
        // console.log('VoterStore, voterFacebookSaveToCurrentAccount');
        // >No application code in stores!<   VoterActions.voterRetrieve();
        return {
          ...state,
          facebookSignInStatus: {
            facebook_account_created: action.res.facebook_account_created,
          },
        };

      case 'voterEmailQueuedToSave':
        // console.log('VoterStore voterEmailQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            voterEmailQueuedToSave: '',
            voterEmailQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            voterEmailQueuedToSave: action.payload,
            voterEmailQueuedToSaveSet: true,
          };
        }

      case 'voterFirstNameQueuedToSave':
        // console.log('VoterStore voterFirstNameQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            voterFirstNameQueuedToSave: '',
            voterFirstNameQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            voterFirstNameQueuedToSave: action.payload,
            voterFirstNameQueuedToSaveSet: true,
          };
        }

      case 'voterLastNameQueuedToSave':
        // console.log('VoterStore voterLastNameQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            voterLastNameQueuedToSave: '',
            voterLastNameQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            voterLastNameQueuedToSave: action.payload,
            voterLastNameQueuedToSaveSet: true,
          };
        }

      case 'voterMergeTwoAccounts':
        // console.log('VoterStore, voterMergeTwoAccounts');
        return {
          ...state,
          emailSignInStatus: {
            email_ownership_is_verified: true,
            email_secret_key_belongs_to_this_voter: true,
            email_sign_in_attempted: true,
            email_address_found: true,
            yes_please_merge_accounts: false,
            voter_we_vote_id_from_secret_key: '',
            voter_merge_two_accounts_attempted: true,
          },
          facebookSignInStatus: {
            voter_merge_two_accounts_attempted: true,
          },
          twitterSignInStatus: {
            voter_merge_two_accounts_attempted: true,
          },
        };

      case 'voterNotificationSettingsUpdate':
        // console.log('VoterStore, voterNotificationSettingsUpdate');
        if (!action.res) {
          return {
            ...state,
            voterNotificationSettingsUpdateStatus: {
              apiResponseReceived: true,
              emailFound: false,
              voterFound: false,
              normalizedEmailAddress: '',
              normalizedSmsPhoneNumber: '',
              notificationSettingsFlags: false,
            },
          };
        }
        return {
          ...state,
          voterNotificationSettingsUpdateStatus: {
            apiResponseReceived: true,
            emailFound: action.res.email_found,
            voterFound: action.res.voter_found,
            normalizedEmailAddress: action.res.normalized_email_address,
            normalizedSmsPhoneNumber: action.res.normalized_sms_phone_number,
            notificationSettingsFlags: action.res.notification_settings_flags,
          },
        };

      case 'voterPhotoQueuedToSave':
        // console.log('VoterStore voterPhotoQueuedToSave: ', action.payload);
        if (action.payload === undefined) {
          return {
            ...state,
            voterPhotoQueuedToSave: '',
            voterPhotoQueuedToSaveSet: false,
          };
        } else {
          return {
            ...state,
            voterPhotoQueuedToSave: action.payload,
            voterPhotoQueuedToSaveSet: true,
          };
        }

      case 'voterPhotoSave':
        // console.log('VoterStore, voterPhotoSave');
        return {
          ...state,
          voter: { ...state.voter, facebook_profile_image_url_https: action.res.facebook_profile_image_url_https },
        };

      case 'voterPhotoTooBigReset':
        // console.log('VoterStore, voterPhotoTooBigReset');
        return {
          ...state,
          voterPhotoTooBig: false,
        };

      case 'voterRetrieve':
        // console.log("VoterStore, voterRetrieve state on entry: ",  state);
        // console.log("VoterStore, voterRetrieve state on entry: ",  state.voter);

        // Preserve address within voter
        incomingVoter = action.res;
        incomingVoter.needsVoterRetrieve = false;
        ({ canEditCampaignXOwnedByOrganizationList, facebookPhotoRetrieveLoopCount, voterFirstRetrieveCompleted } = state);
        if ('can_edit_campaignx_owned_by_organization_list' in action.res) {
          canEditCampaignXOwnedByOrganizationList = action.res.can_edit_campaignx_owned_by_organization_list;
        }
        if (!voterFirstRetrieveCompleted) {
          voterFirstRetrieveCompleted = Boolean(action.res.success);
        }

        currentVoterDeviceId = Cookies.get('voter_device_id');
        if (!action.res.voter_found) {
          console.log(`This voter_device_id is not in the db and is invalid, so delete it: ${
            Cookies.get('voter_device_id')}`);

          // Attempt to delete in a variety of ways
          Cookies.remove('voter_device_id');
          Cookies.remove('voter_device_id', { path: '/' });
          Cookies.remove('voter_device_id', { path: '/', domain: 'wevote.us' });
        } else {
          voterDeviceId = action.res.voter_device_id;
          if (voterDeviceId) {
            if (currentVoterDeviceId !== voterDeviceId) {
              // console.log("Setting new voter_device_id");
              this.setVoterDeviceIdCookie(voterDeviceId);
            }
          } else {
            // console.log("voter_device_id not returned by voterRetrieve");
          }
        }
        // if (incomingVoter.linked_organization_we_vote_id) {
        //   >No application code in stores!<   OrganizationActions.organizationRetrieve(incomingVoter.linked_organization_we_vote_id);
        // }
        // if (incomingVoter.signed_in_with_apple) {
        //   // Completing the logical OR that can't be conveniently made in the server, since Sign in with Apple is device_id specific
        //   incomingVoter.is_signed_in = incomingVoter.signed_in_with_apple;
        //   const { voter_photo_url_medium: statePhotoMed } = state.voter;
        //   const { voter_photo_url_medium: incomingPhotoMed } = incomingVoter;
        //   if (!statePhotoMed && !incomingPhotoMed) {
        //     incomingVoter.voter_photo_url_medium = 'https://campaigns.wevote.us/img/global/logos/Apple_logo_grey.svg';
        //   }
        // }

        // console.log('voterRetrieve incoming voter_id: ', incomingVoter.we_vote_id);
        return {
          ...state,
          canEditCampaignXOwnedByOrganizationList,
          facebookPhotoRetrieveLoopCount: facebookPhotoRetrieveLoopCount + 1,
          voter: incomingVoter,
          voterFirstRetrieveCompleted,
          voterFound: action.res.voter_found,
        };

      case 'voterSignOut':
        // console.log("VoterStore resetting voterStore via voterSignOut");
        // >No application code in stores!<   VoterActions.voterRetrieve();
        // >No application code in stores!<   VoterActions.voterEmailAddressRetrieve();
        // >No application code in stores!<   VoterActions.voterSMSPhoneNumberRetrieve();
        revisedState = state;
        revisedState = { ...revisedState, ...this.getInitialState() };
        return revisedState;

      case 'voterSMSPhoneNumberRetrieve':
        // console.log('VoterStore  voterSMSPhoneNumberRetrieve: ', action.res.sms_phone_number_list);
        return {
          ...state,
          smsPhoneNumberList: action.res.sms_phone_number_list,
        };

      case 'voterSMSPhoneNumberSave':
        // console.log('VoterStore  voterSMSPhoneNumberSave ');
        // >No application code in stores!<   VoterActions.voterRetrieve();
        // >No application code in stores!<   VoterActions.voterSMSPhoneNumberRetrieve();
        return {
          ...state,
          smsPhoneNumberList: action.res.sms_phone_number_list,
          smsPhoneNumberStatus: {
            sms_verify_attempted: action.res.sms_verify_attempted,
            sms_phone_number_already_owned_by_other_voter: action.res.sms_phone_number_already_owned_by_other_voter,
            sms_phone_number_already_owned_by_this_voter: action.res.sms_phone_number_already_owned_by_this_voter,
            sms_phone_number_created: action.res.sms_phone_number_created,
            sms_phone_number: action.res.sms_phone_number,
            sms_phone_number_found: action.res.sms_phone_number_found,
            sms_phone_number_deleted: action.res.sms_phone_number_deleted,
            make_primary_sms: action.res.make_primary_sms,
            secret_code_system_locked_for_this_voter_device_id: action.res.secret_code_system_locked_for_this_voter_device_id,
            sign_in_code_sms_sent: action.res.sign_in_code_sms_sent,
            verification_sms_sent: action.res.verification_sms_sent,
          },
        };

        // case 'voterSplitIntoTwoAccounts':
        //   // console.log('VoterStore  voterSplitIntoTwoAccounts ');
        //   >No application code in stores!<   VoterActions.voterRetrieve();
        //   return state;

      case 'voterTwitterSaveToCurrentAccount':
        // console.log('VoterStore  voterTwitterSaveToCurrentAccount ');
        // >No application code in stores!<   VoterActions.voterRetrieve();
        return {
          ...state,
          twitterSignInStatus: {
            twitter_account_created: action.res.twitter_account_created,
          },
        };

      case 'voterUpdate':
        // console.log('VoterStore  voterUpdate ');
        if (action.res.success) {
          let interfaceStatusFlags = action.res.interface_status_flags;
          if (interfaceStatusFlags === undefined) {
            interfaceStatusFlags = state.voter.interface_status_flags;
          }
          let notificationSettingsFlags = action.res.notification_settings_flags;
          if (notificationSettingsFlags === undefined) {
            notificationSettingsFlags = state.voter.notification_settings_flags;
          }
          // if (action.res.voter_updated && this.getLinkedOrganizationWeVoteId()) {
          //   // console.log('voter_updated:', action.res.voter_updated);
          //   >No application code in stores!<   OrganizationActions.organizationRetrieve(this.getLinkedOrganizationWeVoteId());
          // }
          return {
            ...state,
            voter: {
              ...state.voter,
              // With this we are only updating the values we change with a voterUpdate call.
              facebook_email: action.res.email || state.voter.email,
              first_name: action.res.first_name,
              interface_status_flags: interfaceStatusFlags,
              last_name: action.res.last_name,
              notification_settings_flags: notificationSettingsFlags,
              voter_donation_history_list: action.res.voter_donation_history_list || state.voter.voter_donation_history_list,
              voter_photo_url_large: action.res.we_vote_hosted_profile_image_url_large,
              voter_photo_url_medium: action.res.we_vote_hosted_profile_image_url_medium,
              voter_photo_url_tiny: action.res.we_vote_hosted_profile_image_url_tiny,
            },
            voterPhotoTooBig: action.res.voter_photo_too_big || false,
          };
        } else {
          return {
            ...state,
            voterPhotoTooBig: action.res.voter_photo_too_big || false,
          };
        }

      case 'voterVerifySecretCode':
        // console.log("VoterStore, voterVerifySecretCode, action.res:", action.res);
        incorrectSecretCodeEntered = (action.res.incorrect_secret_code_entered && action.res.incorrect_secret_code_entered === true);
        numberOfTriesRemaining = action.res.number_of_tries_remaining_for_this_code;
        secretCodeVerified = (action.res.secret_code_verified && action.res.secret_code_verified === true);
        voterMustRequestNewCode = (action.res.voter_must_request_new_code && action.res.voter_must_request_new_code === true);
        voterSecretCodeRequestsLocked = (action.res.secret_code_system_locked_for_this_voter_device_id && action.res.secret_code_system_locked_for_this_voter_device_id === true);
        // >No application code in stores!<   VoterActions.voterRetrieve();
        // >No application code in stores!<   VoterActions.voterEmailAddressRetrieve();
        // >No application code in stores!<   VoterActions.voterSMSPhoneNumberRetrieve();
        return {
          ...state,
          secretCodeVerificationStatus: {
            incorrectSecretCodeEntered,
            numberOfTriesRemaining,
            secretCodeVerified,
            voterMustRequestNewCode,
            voterSecretCodeRequestsLocked,
          },
          voter: {
            ...state.voter,
            needsVoterRetrieve: secretCodeVerified,
          },
        };

      case 'appleSignInSave':
        if (action.res.success) {
          // eslint-disable-next-line camelcase
          const { first_name, middle_name, last_name, email, user_code: appleUserCode } = action.res;
          // >No application code in stores!<   VoterActions.voterRetrieve();
          return {
            ...state,
            voter: {
              first_name,
              middle_name,
              last_name,
              email,
              appleUserCode,
              signed_in_with_apple: true,
            },
          };
        } else {
          console.log('Received a bad response from appleSignInSave API call');
          return state;
        }

      case 'deviceStoreFirebaseCloudMessagingToken':
        if (action.res.success) {
          // console.log('Received success from deviceStoreFirebaseCloudMessagingToken API call');
          return state;
        } else {
          console.log('Received a bad response from deviceStoreFirebaseCloudMessagingToken API call');
          return state;
        }

      case 'voterContactListRetrieve':
        // console.log('VoterStore voterContactListRetrieve action:', action);
        if (action.res.success) {
          const {
            voter_contact_email_google_count: voterContactEmailGoogleCount,
            voter_contact_email_list: voterContactEmailList,
          } = action.res;
          return {
            ...state,
            voterContactEmailGoogleCount,
            voterContactEmailList,
          };
        } else {
          console.log('response voterContactListRetrieve was not successful');
          return state;
        }

      case 'voterContactListSave':
        // console.log('VoterStore voterContactListSave action:', action);
        if (action.res.success) {
          const {
            we_vote_id_for_google_contacts: weVoteIdForGoogleContacts,
            contacts_stored: googleContactsStored,
            voter_contact_email_google_count: voterContactEmailGoogleCount,
            voter_contact_email_list: voterContactEmailList,
          } = action.res;
          return {
            ...state,
            weVoteIdForGoogleContacts,
            googleContactsStored,
            voterContactEmailGoogleCount,
            voterContactEmailList,
          };
        } else {
          console.log('response voterContactListSave was not successful');
          return state;
        }

      case 'error-voterRetrieve' || 'error-voterAddressRetrieve' || 'error-voterAddressSave':
        // console.log('VoterStore action', action);
        return state;

      default:
        return state;
    }
  }
}

export default new VoterStore(Dispatcher);
