import { isWebApp } from '../utils/cordovaUtils'; // eslint-disable-line import/no-cycle
import Dispatcher from '../dispatcher/Dispatcher';
import FacebookConstants from '../constants/FacebookConstants';
import { oAuthLog } from '../utils/logging';
import signInModalGlobalState from '../components/Settings/signInModalGlobalState';
import webAppConfig from '../config';
// import { dumpObjProps } from '../utils/appleSiliconUtils';

// Including FacebookStore causes problems in the WebApp, and again in the Native App

/*
For the WebApp, see initFacebook() in Application.jsx
For Cordova we rely on the FacebookConnectPlugin4
   from https://www.npmjs.com/package/cordova-plugin-facebook4
this is the "Jeduan" fork from https://github.com/jeduan/cordova-plugin-facebook4
The "Jeduan" fork is forked from the VERY OUT OF DATE https://github.com/Wizcorp/phonegap-facebook-plugin
As of May 2018, the "Wizcorp" fork has not been maintained for 3 years, even though it
displays the (WRONG) note "This is the official plugin for Facebook in Apache Cordova/PhoneGap!"
 */

export default {
  facebookApi () {
    return isWebApp() ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
  },

  appLogout () {
    // signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
  },

  disconnectFromFacebook () {
    // Removing connection between We Vote and Facebook
    Dispatcher.dispatch({
      type: FacebookConstants.FACEBOOK_SIGN_IN_DISCONNECT,
      data: true,
    });
  },

  facebookDisconnect () {
    Dispatcher.loadEndpoint('facebookDisconnect');
  },

  // Sept 2017, We now use the Facebook "games" api "invitable_friends" data on the fly from the webapp for the "Choose Friends" feature.
  // We use the more limited "friends" api call from the server to find Facebook profiles of friends already using We Vote.
  facebookFriendsAction () {
    Dispatcher.loadEndpoint('facebookFriendsAction', {});
    // FriendActions.suggestedFriendList();
  },

  // https://developers.facebook.com/docs/graph-api/reference/v2.6/user
  getVoterInfoFromFacebookAPI () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.getVoterInfoFromFacebookAPI was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }
    // console.log('FacebookActions.getVoterInfoFromFacebookAPI invocation');
    if (this.facebookApi()) {
      this.facebookApi().api(
        '/me?fields=id,email,first_name,middle_name,last_name,cover', (response) => {
          // console.log('FacebookActions.getVoterInfoFromFacebookAPI response ', response);
          oAuthLog('getVoterInfoFromFacebookAPI response', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_RECEIVED_DATA,
            data: response,
          });
        },
      );
    } else {
      console.error('FacebookActions.getVoterInfoFromFacebookAPI was not invoked, this.facebookApi() undefined');
    }
  },

  // Save incoming data from Facebook
  // For offsets, see https://developers.facebook.com/docs/graph-api/reference/cover-photo/
  facebookSaveVoterSignInData (data) {
  /**
   * Save incoming data from Facebook
   * For offsets, see https://developers.facebook.com/docs/graph-api/reference/cover-photo/
   * @param data
   * @param data.cover.offset_x
   * @param data.cover.offset_y
   */
    // console.log("FacebookActions facebookSaveVoterSignInData, data:", data);
    let background = false;
    let offsetX = false;
    let offsetY = false;
    if (data.cover && data.cover.source) {
      background = data.cover.source;
      offsetX = data.cover.offset_x;  // zero is a valid value so can't use the short-circuit operation " || false"
      offsetY = data.cover.offset_y;  // zero is a valid value so can't use the short-circuit operation " || false"
    }

    Dispatcher.loadEndpoint('voterFacebookSignInSave', {
      facebook_access_token: data.accessToken || false,
      facebook_background_image_offset_x: offsetX,
      facebook_background_image_offset_y: offsetY,
      facebook_background_image_url_https: background,
      facebook_email: data.email || false,
      facebook_expires_in: data.expiresIn || false,
      facebook_first_name: data.firstName || false,
      facebook_last_name: data.lastName || false,
      facebook_middle_name: data.middleName || false,
      facebook_profile_image_url_https: data.url || false,
      facebook_signed_request: data.signedRequest || false,
      facebook_user_id: data.id || data.userID || false,
      save_auth_data: false,
      save_profile_data: true,
    });
  },

  getPicture () {
    this.facebookApi().api(
      '/me?fields=picture.type(large)&redirect=false', ['public_profile', 'email'],
      (response) => {
        oAuthLog('getFacebookProfilePicture response', response);
        Dispatcher.dispatch({
          type: FacebookConstants.FACEBOOK_RECEIVED_PICTURE,
          data: response,
        });
      },
    );
  },

  getFacebookProfilePicture () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.getFacebookProfilePicture was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }
    oAuthLog('getFacebookProfilePicture before fields request');

    // Our "signed_in_facebook" field in the postgres database does not mean the user is actually signed in to facebook, it
    // means that at some point in the past, the voter has logged into facebook and they *might* still be logged into facebook,
    // but regardless of whether they are actually logged into facebook at this moment, we consider them "logged in to WeVote"
    // having using facebook auth in the past.  That is ok for our authentication methodology, but if you assume you are really
    // logged into facebook in Cordova, and your're not, you get a distracting login dialog that comes from the facebook native
    // package everytime we refresh the avatar in the header in this function -- so first check if the voter is really logged in.
    if (this.facebookApi()) {
      this.getPicture();
    } else {
      console.log('FacebookActions.getFacebookProfilePicture was not invoked, this.facebookApi() undefined');
    }
  },

  getFacebookInvitableFriendsList (pictureWidth, pictureHeight) {
    const pictureWidthVerified = pictureWidth || 50;
    const pictureHeightVerified = pictureHeight || 50;
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.getFacebookInvitableFriendsList was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (this.facebookApi()) {
      const fbApiForInvitableFriends = `/me?fields=invitable_friends.limit(1000){name,id,picture.width(${pictureWidthVerified}).height(${pictureHeightVerified})`;
      this.facebookApi().api(
        fbApiForInvitableFriends,
        (response) => {
          oAuthLog('getFacebookInvitableFriendsList', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_RECEIVED_INVITABLE_FRIENDS,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.getFacebookInvitableFriendsList was not invoked, this.facebookApi() undefined');
    }
  },

  readFacebookAppRequests () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.readFacebookAppRequests was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (this.facebookApi()) {
      const fbApiForReadingAppRequests = 'me?fields=apprequests.limit(10){from,to,created_time,id}';
      this.facebookApi().api(
        fbApiForReadingAppRequests,
        (response) => {
          oAuthLog('readFacebookAppRequests', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_READ_APP_REQUESTS,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.readFacebookAppRequests was not invoked, this.facebookApi() undefined');
    }
  },

  deleteFacebookAppRequest (requestId) {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.deleteFacebookAppRequest was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (this.facebookApi()) {
      console.log('deleteFacebookAppRequest requestId: ', requestId);
      this.facebookApi().api(
        requestId,
        'delete',
        (response) => {
          oAuthLog('deleteFacebookAppRequest response', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_DELETE_APP_REQUEST,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.deleteFacebookAppRequest was not invoked, this.facebookApi() undefined');
    }
  },

  logout () {
    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.logout was not invoked, see ENABLE_FACEBOOK in config.js');
      return;
    }

    if (this.facebookApi()) {
      this.facebookApi().logout(
        (response) => {
          oAuthLog('FacebookActions logout response: ', response);
          Dispatcher.dispatch({
            type: FacebookConstants.FACEBOOK_LOGGED_OUT,
            data: response,
          });
        },
      );
    } else {
      console.log('FacebookActions.logout was not invoked, this.facebookApi() undefined');
    }
  },

  loginSuccess (successResponse) {
    signInModalGlobalState.set('facebookSignInStep', 'getVotersFacebookData');
    if (successResponse.authResponse) {
      oAuthLog('FacebookActions loginSuccess userData: ', successResponse);
      Dispatcher.dispatch({
        type: FacebookConstants.FACEBOOK_LOGGED_IN,
        data: successResponse,
      });
    } else {
      // Check if successResponse.authResponse is null indicating cancelled login attempt
      oAuthLog('FacebookActions null authResponse indicating cancelled login attempt: ', successResponse);
    }
  },

  loginFailure (errorResponse) {
    oAuthLog('FacebookActions loginFailure error response: ', errorResponse);
  },

  getPermissions () {
    if (isWebApp()) {
      return {
        scope: 'public_profile, email',   // was 'public_profile, email, user_friends', prior to Oct 2020
      };
    } else {
      return ['public_profile', 'email'];  // was ['public_profile', 'email', 'user_friends']; prior to Oct 2020
    }
  },

  login () {
    if (!webAppConfig.FACEBOOK_APP_ID) {
      console.log('ERROR: Missing FACEBOOK_APP_ID from src/js/config.js'); // DO NOT REMOVE THIS!
    }

    if (!webAppConfig.ENABLE_FACEBOOK) {
      console.log('FacebookActions.login was not invoked, see ENABLE_FACEBOOK in config.js'); // DO NOT REMOVE THIS!
      return;
    }

    // FB.getLoginStatus does an ajax call and when you call FB.login on it's response, the popup that would open
    // as a result of this call is blocked. A solution to this problem would be to to specify status: true in the
    // options object of FB.init and you need to be confident that login status has already loaded.
    oAuthLog('FacebookActions this.facebookApi().login');

    if (this.facebookApi()) {
      const innerThis = this;

      signInModalGlobalState.set('facebookSignInStep', 'gettingLoginStatus');
      this.facebookApi().getLoginStatus(
        (response) => {
          oAuthLog('FacebookActions this.facebookApi().getLoginStatus response: ', response);
          try {
            oAuthLog('FacebookActions this.facebookApi().getLoginStatus response.userID: ', response.authResponse.userID);
          } catch (error) {
            oAuthLog('FacebookActions this.facebookApi().getLoginStatus response.authResponse.userID not found  ');
          }
          // try {
          //   dumpObjProps('facebookApi().getLoginStatus()', response);
          //   dumpObjProps('facebookApi().getLoginStatus()', response.authResponse);
          // } catch (e) {
          //   console.log('dumping object props for fbapi:', e);
          // }
          if (response.status === 'connected') {
            signInModalGlobalState.set('facebookSignInStep', 'processingConnected');
            Dispatcher.dispatch({
              type: FacebookConstants.FACEBOOK_LOGGED_IN,
              data: response,
            });
          } else {
            signInModalGlobalState.set('facebookSignInStep', 'loggingInViaFbApi');
            signInModalGlobalState.set('facebookSignInStatus', 'Attempting Facebook login...');
            if (isWebApp()) { // eslint-disable-line no-lonely-if
              window.FB.login(innerThis.loginSuccess, innerThis.loginFailure, innerThis.getPermissions());
            } else {
              window.facebookConnectPlugin.login(innerThis.getPermissions(), innerThis.loginSuccess, innerThis.loginFailure);
            }
          }
        },
      );
    } else {
      console.error('FacebookActions.login was not invoked, this.facebookApi() undefined');
    }
  },

  // July 2017: Not called from anywhere
  savePhoto (url) {
    Dispatcher.loadEndpoint('voterPhotoSave', { facebook_profile_image_url_https: url });
  },

  // Save incoming auth data from Facebook
  saveFacebookSignInAuth (data) {
    // console.log('saveFacebookSignInAuth (result of incoming data from the FB API) kicking off an api server voterFacebookSignInSave');
    // const fbState = signInModalGlobalState.getAll();  // For debug
    // console.log('saveFacebookSignInAuth fbState:', fbState);
    Dispatcher.loadEndpoint('voterFacebookSignInSave', {
      facebook_access_token: data.accessToken || false,
      facebook_user_id: data.userID || data.userId || false,
      facebook_expires_in: data.expiresIn || false,
      facebook_signed_request: data.signedRequest || false,
      save_auth_data: true,
      save_profile_data: false,
      facebook_sign_in_failed: data.facebook_sign_in_failed,
      facebook_sign_in_found: data.facebook_sign_in_found,
      facebookIsLoggedIn: data.facebookIsLoggedIn,
    });
  },

  voterFacebookSignInPhoto (facebookUserId, data) {
    // console.log("FacebookActions voterFacebookSignInPhoto, data:", data);
    if (data) {
      Dispatcher.loadEndpoint('voterFacebookSignInSave', {
        facebook_user_id: facebookUserId || false,
        facebook_profile_image_url_https: data.url || false,
        save_photo_data: true,
      });
    }
  },

  voterFacebookSignInRetrieve () {
    Dispatcher.loadEndpoint('voterFacebookSignInRetrieve', {
    });
  },

  voterFacebookSignInConfirm () {
    Dispatcher.loadEndpoint('voterFacebookSignInRetrieve', {
    });
  },
};
