import { ReduceStore } from 'flux/utils';
import Dispatcher from '../components/Dispatcher/Dispatcher';
import FacebookConstants from '../constants/FacebookConstants';
import signInModalGlobalState from '../components/Widgets/signInModalGlobalState';

class FacebookStore extends ReduceStore {
  getInitialState () {
    return {
      authData: {},
      emailData: {},
      appRequestAlreadyProcessed: false,
      facebookFriendsNotExist: false,
      facebookInvitableFriendsRetrieved: false,
    };
  }

  get facebookAuthData () {
    return this.getState().authData;
  }

  get facebookEmailData () {
    return this.getState().emailData;
  }

  get facebookUserId () {
    return this.getState().userId;
  }

  getFacebookAuthData () {
    return this.getState().facebookAuthData;
  }


  getFacebookAuthResponse () {
    return this.getState().facebookAuthData;
  }

  getFacebookEmailInfo () {
    return {
      userId: this.facebookEmailData.id,
      email: this.facebookEmailData.email,
    };
  }

  get loggedIn () {
    if (!this.facebookAuthData) {
      return undefined;
    }

    return this.facebookAuthData.status === 'connected';
  }

  get userId () {
    if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
      return undefined;
    }

    return this.facebookAuthData.authResponse.userID;
  }

  get accessToken () {
    if (!this.facebookAuthData || !this.facebookAuthData.authResponse) {
      return undefined;
    }

    return this.facebookAuthData.authResponse.accessToken;
  }

  facebookFriendsUsingWeVoteList () {
    return this.getState().facebook_friends_using_we_vote_list || [];
  }

  facebookInvitableFriends () {
    const {
      facebookInvitableFriendsList, facebookInvitableFriendsRetrieved, facebookFriendsNotExist,
    } = this.getState();
    return {
      facebook_invitable_friends_list: facebookInvitableFriendsList,
      facebook_friends_not_exist: facebookFriendsNotExist,
      facebook_invitable_friends_retrieved: facebookInvitableFriendsRetrieved,
    };
  }

  facebookAppRequestAlreadyProcessed () {
    return this.getState().appRequestAlreadyProcessed;
  }

  reduce (state, action) {
    let facebookFriendsNotExist = false;
    const facebookInvitableFriendsRetrieved = true;
    let facebookInvitableFriendsList = [];
    let appRequestAlreadyProcessed = false;
    let facebookProfileImageUrlHttps = '';
    let signInFound = false;

    switch (action.type) {
      case FacebookConstants.FACEBOOK_LOGGED_IN:
        signInModalGlobalState.set('facebookSignInStep', 'getVotersFacebookData');

        // console.log('FACEBOOK_LOGGED_IN action.data:', action.data);
        // console.log('case FacebookConstants.FACEBOOK_LOGGED_IN fbState:', signInModalGlobalState.getAll());
        // console.log('case FacebookConstants.FACEBOOK_LOGGED_IN fbState all:', all);

        try {
          signInFound = action.data.authResponse.userID > 0;
          // eslint-disable-next-line no-empty
        } catch (e) {}

        return {
          ...state,
          facebookAuthData: {
            accessToken: action.data.authResponse.accessToken,
            data_access_expiration_time: action.data.authResponse.data_access_expiration_time,
            expiresIn: action.data.authResponse.expiresIn,
            signedRequest: action.data.authResponse.signedRequest,
            userID: action.data.authResponse.userID,
            status: action.data.status,
          },
          authData: action.data,
          facebook_sign_in_found: signInFound,
          facebook_sign_in_failed: !signInFound,
          facebook_retrieve_attempted: true,
        };

      case FacebookConstants.FACEBOOK_RECEIVED_DATA:
        // Cache the data in the API server
        // console.log("FACEBOOK_RECEIVED_DATA action.data:", action.data);
        // FacebookActions.voterFacebookSignInData(action.data);  // Steve this calls a save to the server
        // FacebookActions.getFacebookProfilePicture();
        return {
          ...state,
          emailData: action.data,
          facebookAuthData: {
            ...state.facebookAuthData,
            email: action.data.email,
            firstName: action.data.first_name,
            id: action.data.id,
            lastName: action.data.last_name,
          },
        };

      case FacebookConstants.FACEBOOK_RECEIVED_INVITABLE_FRIENDS:

        // console.log("FacebookStore, FacebookConstants.FACEBOOK_RECEIVED_INVITABLE_FRIENDS");
        // Cache the data in the API server
        // FacebookActions.getFacebookInvitableFriendsList(action.data.id);
        if (action.data.invitable_friends) {
          facebookInvitableFriendsList = action.data.invitable_friends.data;
        } else {
          facebookFriendsNotExist = true;
        }

        // console.log("FACEBOOK_RECEIVED_INVITABLE_FRIENDS: ", facebook_invitable_friends_list);
        return {
          ...state,
          facebookInvitableFriendsList,
          facebookFriendsNotExist,
          facebookInvitableFriendsRetrieved,
        };

      case FacebookConstants.FACEBOOK_READ_APP_REQUESTS:

        // console.log("FacebookStore appreqests:", action.data.apprequests);
        if (action.data.apprequests) {
          // const apprequestsData = action.data.apprequests.data[0];
          // const recipientFacebookUserId = apprequestsData.to.id;
          // const senderFacebookId = apprequestsData.from.id;
          // const facebookRequestId = apprequestsData.id;
          // FriendActions.friendInvitationByFacebookVerify(facebookRequestId, recipientFacebookUserId, senderFacebookId);
        } else {
          appRequestAlreadyProcessed = true;
        }

        // console.log("app_request_already_processed", app_request_already_processed);
        return {
          ...state,
          appRequestAlreadyProcessed,
        };

      case FacebookConstants.FACEBOOK_DELETE_APP_REQUEST:
        return {
          ...state,
        };

      case 'voterFacebookSignInRetrieve':
        // console.log("FacebookStore voterFacebookSignInRetrieve, facebook_sign_in_verified: ", action.res.facebook_sign_in_verified);
        return {
          ...state,
          voter_device_id: action.res.voter_device_id,
          voter_has_data_to_preserve: action.res.voter_has_data_to_preserve,
          facebook_retrieve_attempted: action.res.facebook_retrieve_attempted,
          facebook_sign_in_found: action.res.facebook_sign_in_found,
          facebook_sign_in_verified: action.res.facebook_sign_in_verified,
          facebook_sign_in_failed: action.res.facebook_sign_in_failed,
          facebook_secret_key: action.res.facebook_secret_key,

          // yes_please_merge_accounts: action.res.yes_please_merge_accounts,
          existing_facebook_account_found: action.res.existing_facebook_account_found,
          voter_we_vote_id_attached_to_facebook: action.res.voter_we_vote_id_attached_to_facebook,
          voter_we_vote_id_attached_to_facebook_email: action.res.voter_we_vote_id_attached_to_facebook_email,

          // facebook_email: action.res.facebook_email,
          // facebook_first_name: action.res.facebook_first_name,
          // facebook_middle_name: action.res.facebook_middle_name,
          // facebook_last_name: action.res.facebook_last_name,
          facebook_profile_image_url_https: action.res.facebook_profile_image_url_https,
          facebook_friends_list: action.res.facebook_friends_list,

          // The new way 2/19/20, soft abandoning lines above...
          facebookAuthData: {
            ...state.facebookAuthData,
            facebook_retrieve_attempted: action.res.facebook_retrieve_attempted,
            facebook_sign_in_found: action.res.facebook_sign_in_found,
            facebook_sign_in_verified: action.res.facebook_sign_in_verified,
            facebook_sign_in_failed: action.res.facebook_sign_in_failed,
            facebook_secret_key: action.res.facebook_secret_key,
            existing_facebook_account_found: action.res.existing_facebook_account_found,
            voter_we_vote_id_attached_to_facebook: action.res.voter_we_vote_id_attached_to_facebook,
            voter_we_vote_id_attached_to_facebook_email: action.res.voter_we_vote_id_attached_to_facebook_email,

          },

        };

      case 'voterFacebookSignInSave':

        // console.log("FacebookStore voterFacebookSignInSave, minimum_data_saved: ", action.res.minimum_data_saved);
        if (action.res.minimum_data_saved) {
          // Only reach out for the Facebook Sign In information if the save_profile_data call has completed
          // TODO: We need a check here to prevent an infinite loop if the local voter_device_id isn't recognized by server
          // console.log("FacebookStore voterFacebookSignInSave, voter exists");
          // FacebookActions.voterFacebookSignInRetrieve();
        }

        return {
          ...state,
          facebook_save_attempted: action.res.facebook_save_attempted,
          facebook_sign_in_saved: action.res.facebook_sign_in_saved,
        };

      case 'voterSignOut':

        // console.log("resetting FacebookStore");
        return {
          authData: {},
          pictureData: {},
          emailData: {},
        };

      /* Sept 6, 2017, has been replaced by facebook Game API friends list */
      case 'facebookFriendsAction':
        return {
          ...state,
          facebook_friends_using_we_vote_list: action.res.facebook_friends_using_we_vote_list,
        };

      case FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT:
        this.disconnectFromFacebook();
        return state;

      case FacebookConstants.FACEBOOK_RECEIVED_PICTURE:
        if (action.data && action.data.picture && action.data.picture.data && action.data.picture.data.url) {
          // FacebookActions.voterFacebookSignInPhoto(facebookUserId, action.data.picture.data);
          facebookProfileImageUrlHttps = action.data.picture.data.url;
        }

        return {
          ...state,
          facebook_profile_image_url_https: facebookProfileImageUrlHttps,
        };

      default:
        return state;
    }
  }
}

export default new FacebookStore(Dispatcher);
