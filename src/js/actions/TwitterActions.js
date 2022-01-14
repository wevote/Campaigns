import Dispatcher from '../common/dispatcher/Dispatcher';
// import VoterActions from './VoterActions';
// import VoterSessionActions from './VoterSessionActions';

export default {
  // TODO Convert this to sign out of just Twitter
  appLogout () {
    // VoterSessionActions.voterSignOut();
    // VoterActions.voterRetrieve();
  },

  resetTwitterHandleLanding () {
    Dispatcher.dispatch({ type: 'resetTwitterHandleLanding', payload: true });
  },

  twitterIdentityRetrieve (newTwitterHandle) {
    Dispatcher.loadEndpoint('twitterIdentityRetrieve',
      {
        twitter_handle: newTwitterHandle,
      });
  },

  twitterNativeSignInSave (twitterAccessToken, twitterAccessTokenSecret) {
    Dispatcher.loadEndpoint('twitterNativeSignInSave',
      {
        twitter_access_token: twitterAccessToken,
        twitter_access_token_secret: twitterAccessTokenSecret,
      });
  },

  twitterProcessDeferredImages (twitterImageLoadInfo) {
    Dispatcher.loadEndpoint('twitterProcessDeferredImages', {
      status: twitterImageLoadInfo.status,
      success: twitterImageLoadInfo.success,
      twitter_id: twitterImageLoadInfo.twitter_id,
      twitter_name: twitterImageLoadInfo.twitter_name,
      twitter_profile_banner_url_https: twitterImageLoadInfo.twitter_profile_banner_url_https,
      twitter_profile_image_url_https: twitterImageLoadInfo.twitter_profile_image_url_https,
      twitter_screen_name: twitterImageLoadInfo.twitter_screen_name,
      voter_we_vote_id_for_cache: twitterImageLoadInfo.voter_we_vote_id_for_cache,
    });
  },

  twitterSignInRetrieve () {
    Dispatcher.loadEndpoint('twitterSignInRetrieve', {
      image_load_deferred: true,
    });
  },

  twitterSignInStart (returnUrl) {
    Dispatcher.loadEndpoint('twitterSignInStart',
      {
        return_url: returnUrl,
      });
  },

};
