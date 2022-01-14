import { ReduceStore } from 'flux/utils';
import TwitterActions from '../actions/TwitterActions';
import Dispatcher from '../common/dispatcher/Dispatcher';


class TwitterStore extends ReduceStore {
  getInitialState () {
    return {
      success: true,
    };
  }

  get () {
    return {
      existing_twitter_account_found: this.getState().existing_twitter_account_found || '',
      kind_of_owner: this.getState().kind_of_owner || '',
      owner_we_vote_id: this.getState().owner_we_vote_id || '',
      status: this.status || '',
      twitter_description: this.getState().twitter_description || '',
      twitter_followers_count: this.getState().twitter_followers_count || '',
      twitter_handle: this.getState().twitter_handle || '',
      twitter_handle_found: this.getState().twitter_handle_found || '',
      twitter_images_were_processed: this.getState().twitter_images_were_processed || '',
      twitter_name: this.getState().twitter_name || '',
      twitter_photo_url: this.getState().twitter_photo_url || '',
      twitter_profile_image_url_https: this.getState().twitter_profile_image_url_https || '',
      twitter_retrieve_attempted: this.getState().twitter_retrieve_attempted || '',
      twitter_secret_key: this.getState().twitter_secret_key || '',
      twitter_sign_in_failed: this.getState().twitter_sign_in_failed || '',
      twitter_sign_in_found: this.getState().twitter_sign_in_found || '',
      twitter_sign_in_verified: this.getState().twitter_sign_in_verified || '',
      twitter_user_website: this.getState().twitter_user_website || '',
      voter_device_id: this.getState().voter_device_id || '',
      voter_has_data_to_preserve: this.getState().voter_has_data_to_preserve || '',
      voter_we_vote_id: this.getState().voter_we_vote_id || '',
      voter_we_vote_id_attached_to_twitter: this.getState().voter_we_vote_id_attached_to_twitter || '',
      we_vote_hosted_profile_image_url_large: this.getState().we_vote_hosted_profile_image_url_large || '',
      we_vote_hosted_profile_image_url_medium: this.getState().we_vote_hosted_profile_image_url_medium || '',
      we_vote_hosted_profile_image_url_tiny: this.getState().we_vote_hosted_profile_image_url_tiny || '',
    };
  }

  resetVoterSpecificData () {
    return {
      kind_of_owner: this.getState().kind_of_owner || '',
      owner_we_vote_id: this.getState().owner_we_vote_id || '',
      twitter_handle: this.getState().twitter_handle || '',
      twitter_description: this.getState().twitter_description || '',
      twitter_followers_count: this.getState().twitter_followers_count || '',
      twitter_name: this.getState().twitter_name || '',
      twitter_photo_url: this.getState().twitter_photo_url || '',
      twitter_user_website: this.getState().twitter_user_website || '',
      status: this.status || '',
      twitter_images_were_processed: false,
    };
  }

  // resetState () {
  //   return this.getInitialState();
  // }

  clearTwitterImagesWereProcessed () {
    this._state.twitter_images_were_processed = false;
  }

  clearTwitterImageLoadInfo () {
    this._state.twitter_image_load_info = null;
  }

  // get kindOfOwner () {
  //   return this.getState().kind_of_owner;
  // }
  //
  // get ownerWeVoteId () {
  //   return this.getState().owner_we_vote_id;
  // }

  get twitterHandle () {
    return this.getState().twitter_handle;
  }

  getTwitterImagesWereProcessed () {
    return this.getState().twitter_images_were_processed;
  }

  get status () {
    return this.getState().status;
  }

  getTwitterAuthResponse () {
    return {
      twitter_retrieve_attempted: this.getState().twitter_retrieve_attempted,
      twitter_sign_in_found: this.getState().twitter_sign_in_found,
      twitter_sign_in_verified: this.getState().twitter_sign_in_verified,
      twitter_sign_in_failed: this.getState().twitter_sign_in_failed,
      twitter_secret_key: this.getState().twitter_secret_key,
      twitter_profile_image_url_https: this.getState().twitter_profile_image_url_https,
      voter_has_data_to_preserve: this.getState().voter_has_data_to_preserve,
      existing_twitter_account_found: this.getState().existing_twitter_account_found,
      voter_we_vote_id_attached_to_twitter: this.getState().voter_we_vote_id_attached_to_twitter,
      twitter_image_load_info: this.getState().twitter_image_load_info,
    };
  }

  reduce (state, action) {
    switch (action.type) {
      case 'resetTwitterHandleLanding':
        // console.log('TwitterStore resetTwitterHandleLanding');
        return {
          ...state,
          kind_of_owner: '',
          owner_we_vote_id: '',
          twitter_handle: '',
          twitter_description: '',
          twitter_followers_count: 0,
          twitter_name: '',
          twitter_photo_url: '',
          twitter_user_website: '',
          status: '',
          // voter_device_id: this.getState().voter_device_id || '',
          twitter_handle_found: '',
          twitter_secret_key: '',
          // existing_twitter_account_found: '',
          twitter_profile_image_url_https: '',
          twitter_retrieve_attempted: false,
          // voter_we_vote_id: this.getState().voter_we_vote_id || '',
          voter_we_vote_id_attached_to_twitter: '',
          we_vote_hosted_profile_image_url_large: '',
          we_vote_hosted_profile_image_url_medium: '',
          we_vote_hosted_profile_image_url_tiny: '',
        };

      case 'twitterIdentityRetrieve':
        // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
        if (!action.res || !action.res.success) return state;
        // if (action.res.kind_of_owner === 'ORGANIZATION') {
        //   OrganizationActions.organizationRetrieve(action.res.owner_we_vote_id);
        // } else if (action.res.kind_of_owner === 'CANDIDATE') {
        //   CandidateActions.candidateRetrieve(action.res.owner_we_vote_id);
        //   CandidateActions.positionListForBallotItemPublic(action.res.owner_we_vote_id);
        //   CandidateActions.positionListForBallotItemFromFriends(action.res.owner_we_vote_id);
        // }

        return {
          ...state,
          kind_of_owner: action.res.kind_of_owner,
          owner_we_vote_id: action.res.owner_we_vote_id,
          twitter_handle: action.res.twitter_handle,
          twitter_description: action.res.twitter_description,
          twitter_followers_count: action.res.twitter_followers_count,
          twitter_name: action.res.twitter_name,
          twitter_photo_url: action.res.twitter_photo_url,
          twitter_user_website: action.res.twitter_user_website,
          status: action.res.status,
        };

      case 'twitterNativeSignInSave':
        // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
        if (!action.res || !action.res.success) return state;
        if (action.res.success) {
          TwitterActions.twitterSignInRetrieve();
        }

        return {
          // ...state,
          voter_device_id: action.res.voter_device_id,
          twitter_handle: action.res.twitter_handle,
          twitter_handle_found: action.res.twitter_handle_found,
          twitter_secret_key: action.res.twitter_secret_key,
        };

      case 'twitterProcessDeferredImages':
        if (!action.res || !action.res.success) return state;
        console.log('twitter twitterProcessDeferredImages', action.res);
        return {
          ...state,
          twitter_images_were_processed: action.res.twitter_images_were_processed,
          twitter_profile_image_url_https: action.res.twitter_profile_image_url_https,
          we_vote_hosted_profile_image_url_large: action.res.we_vote_hosted_profile_image_url_large,
          we_vote_hosted_profile_image_url_medium: action.res.we_vote_hosted_profile_image_url_medium,
          we_vote_hosted_profile_image_url_tiny: action.res.we_vote_hosted_profile_image_url_tiny,
        };


      case 'twitterSignInRetrieve':
        // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
        if (!action.res || !action.res.success) return state;
        // 2/11/21:  Moved to TwitterSignInProcess.jsx (untangling app code from stores)
        // if (action.res.twitter_sign_in_verified) {
        //   VoterActions.voterRetrieve();
        //   VoterActions.twitterRetrieveIdsIfollow();
        // }
        return {
          ...state,
          existing_twitter_account_found: action.res.existing_twitter_account_found,
          twitter_profile_image_url_https: action.res.twitter_profile_image_url_https,
          twitter_retrieve_attempted: action.res.twitter_retrieve_attempted,
          twitter_secret_key: action.res.twitter_secret_key,
          twitter_sign_in_failed: action.res.twitter_sign_in_failed,
          twitter_sign_in_found: action.res.twitter_sign_in_found,
          twitter_sign_in_verified: action.res.twitter_sign_in_verified,
          voter_device_id: action.res.voter_device_id,
          voter_has_data_to_preserve: action.res.voter_has_data_to_preserve,
          voter_we_vote_id: action.res.voter_we_vote_id,
          voter_we_vote_id_attached_to_twitter: action.res.voter_we_vote_id_attached_to_twitter,
          we_vote_hosted_profile_image_url_large: action.res.we_vote_hosted_profile_image_url_large,
          we_vote_hosted_profile_image_url_medium: action.res.we_vote_hosted_profile_image_url_medium,
          we_vote_hosted_profile_image_url_tiny: action.res.we_vote_hosted_profile_image_url_tiny,
          twitter_image_load_info: action.res.twitter_image_load_info,
        };

      case 'voterSignOut':
        // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
        if (!action.res || !action.res.success) return state;
        // console.log("resetting TwitterStore");
        // return this.resetState();
        return this.resetVoterSpecificData();

      default:
        // console.log('TwitterStore DEFAULT action.type', action);
        return {
          ...state,
        };
    }
  }
}

export default new TwitterStore(Dispatcher);
