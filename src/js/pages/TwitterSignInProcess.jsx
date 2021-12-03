import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';
import TwitterActions from '../actions/TwitterActions';
import VoterActions from '../actions/VoterActions';
import SpinnerPage from '../components/Widgets/SpinnerPage';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import TwitterStore from '../stores/TwitterStore';
import VoterStore from '../stores/VoterStore';
import Cookies from '../common/utils/js-cookie/Cookies';
import { isWebApp } from '../utils/cordovaUtils';
import historyPush from '../utils/historyPush';
import initializejQuery from '../utils/initializejQuery';
import { oAuthLog, renderLog } from '../common/utils/logging';
import { stringContains } from '../utils/textFormat';


export default class TwitterSignInProcess extends Component {
  constructor (props) {
    super(props);
    this.state = {
      hostname: '',
      mergingTwoAccounts: false,
      redirectInProgress: false,
      twitterAuthResponse: {},
      jqueryLoading: true,
    };
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.twitterStoreListener = TwitterStore.addListener(this.onTwitterStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    initializejQuery(() => {
      this.twitterSignInRetrieve();
      this.setState({
        hostname: AppObservableStore.getHostname(),
        jqueryLoading: false,
      });
    });
    const { setShowHeaderFooter } = this.props;
    setShowHeaderFooter(false);
  }

  componentWillUnmount () {
    const { setShowHeaderFooter } = this.props;
    setShowHeaderFooter(true);
    this.appStateSubscription.unsubscribe();
    this.twitterStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const hostname = AppObservableStore.getHostname();
    this.setState({
      hostname,
    });
  }

  onTwitterStoreChange () {
    const twitterAuthResponse = TwitterStore.getTwitterAuthResponse();
    this.setState({
      twitterAuthResponse,
    });
    // 2/11/21:  This was in TwitterStore.jsx (untangling app code from stores)
    if (twitterAuthResponse.twitter_sign_in_found && twitterAuthResponse.twitter_sign_in_verified) {
      // console.log('onTwitterStoreChange fired voterRetrieve -- since twitter_sign_in_found -- twitterAuthResponse:', twitterAuthResponse);
      VoterActions.voterRetrieve();
    }
    // 2/11/21, Moved from render (since it sets state)
    if (twitterAuthResponse.twitter_sign_in_failed === true) {
      oAuthLog('Twitter sign in failed - push to /settings/account');  // TODO: /settings/account does not exist in Campaign
      this.setState({ redirectInProcess: true });
      const { setShowHeaderFooter } = this.props;
      setShowHeaderFooter(true);
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Twitter sign in failed. Please try again.',
          message_type: 'success',
        },
      });
    }

    if (twitterAuthResponse.twitter_sign_in_found === false) {
      this.setState({ redirectInProcess: true });
      oAuthLog('twitterAuthResponse.twitter_sign_in_found: ', twitterAuthResponse.twitter_sign_in_found);  // TODO: /settings/account does not exist in Campaign
      const { setShowHeaderFooter } = this.props;
      setShowHeaderFooter(true);
      historyPush({
        pathname: '/settings/account',
        state: {
          message: 'Twitter authentication not found. Please try again.',
          message_type: 'warning',
        },
      });
    }
  }

  onVoterStoreChange () {
    const { redirectInProcess } = this.state;
    // console.log('TwitterSignInProcess onVoterStoreChange, redirectInProcess:', redirectInProcess);
    if (!redirectInProcess) {
      const twitterSignInStatus = VoterStore.getTwitterSignInStatus();
      // console.log('twitterSignInStatus:', twitterSignInStatus);
      const voter = VoterStore.getVoter();
      const { signed_in_twitter: voterIsSignedInTwitter } = voter;
      if (voterIsSignedInTwitter || (twitterSignInStatus && twitterSignInStatus.voter_merge_two_accounts_attempted)) {
        // Once the Twitter merge returns successfully, redirect to starting page
        let redirectFullUrl = '';
        let signInStartFullUrl = Cookies.get('sign_in_start_full_url');
        // console.log('TwitterSignInProcess signInStartFullUrl:', signInStartFullUrl);
        if (signInStartFullUrl && stringContains('twitter_sign_in', signInStartFullUrl)) {
          // Do not support a redirect to facebook_sign_in
          // console.log('TwitterSignInProcess Ignore facebook_sign_in url');
          signInStartFullUrl = null;
        }
        if (signInStartFullUrl) {
          // console.log('TwitterSignInProcess Executing Redirect');
          AppObservableStore.unsetStoreSignInStartFullUrl();
          Cookies.remove('sign_in_start_full_url', { path: '/' });
          Cookies.remove('sign_in_start_full_url', { path: '/', domain: 'wevote.us' });
          redirectFullUrl = signInStartFullUrl;
          // if (!voterHasDataToPreserve) {
          //   redirectFullUrl += '?voter_refresh_timer_on=1';
          // }
          let useWindowLocationAssign = true;
          if (window && window.location && window.location.origin) {
            if (stringContains(window.location.origin, redirectFullUrl)) {
              // Switch to path names to reduce load on browser and API server
              useWindowLocationAssign = false;
              const newRedirectPathname = isWebApp() ? redirectFullUrl.replace(window.location.origin, '') : '/ballot';
              // console.log('newRedirectPathname:', newRedirectPathname);
              this.setState({ redirectInProcess: true });
              oAuthLog(`Twitter sign in (1), onVoterStoreChange - push to ${newRedirectPathname}`);
              const { setShowHeaderFooter } = this.props;
              setShowHeaderFooter(true);
              historyPush({
                pathname: newRedirectPathname,
                state: {
                  message: 'You have successfully signed in with Twitter.',
                  message_type: 'success',
                },
              });
            } else {
              console.log('window.location.origin empty');
            }
          }
          if (useWindowLocationAssign) {
            // console.log('useWindowLocationAssign:', useWindowLocationAssign);
            this.setState({ redirectInProcess: true });
            window.location.assign(redirectFullUrl);
          }
        } else {
          this.setState({ redirectInProcess: true });
          const redirectPathname = '/';
          oAuthLog(`Twitter sign in (2), onVoterStoreChange - push to ${redirectPathname}`);
          const { setShowHeaderFooter } = this.props;
          setShowHeaderFooter(true);
          historyPush({
            pathname: redirectPathname,
            // query: {voter_refresh_timer_on: voterHasDataToPreserve ? 0 : 1},
            state: {
              message: 'You have successfully signed in with Twitter.',
              message_type: 'success',
            },
          });
        }
      }
    }
  }

  voterMergeTwoAccountsByTwitterKey (twitterSecretKey) {  // , voterHasDataToPreserve = true
    const { mergingTwoAccounts } = this.state;
    if (mergingTwoAccounts) {
      // console.log('In process of mergingTwoAccounts');
    } else {
      // console.log('About to make voterMergeTwoAccountsByTwitterKey API call');
      VoterActions.voterMergeTwoAccountsByTwitterKey(twitterSecretKey);
      // Prevent voterMergeTwoAccountsByFacebookKey from being called multiple times
      this.setState({ mergingTwoAccounts: true });
    }
  }

  // This creates the public.twitter_twitterlinktovoter entry, which is needed
  // to establish is_signed_in within the voter.voter
  voterTwitterSaveToCurrentAccount () {
    // console.log('voterTwitterSaveToCurrentAccount');
    VoterActions.voterTwitterSaveToCurrentAccount();
    if (VoterStore.getVoterPhotoUrlMedium().length === 0) {
      // This only fires once, for brand new users on their very first login
      // console.log('voterTwitterSaveToCurrentAccount fired voterRetrieve -- should not normally happen');
      VoterActions.voterRetrieve();
    }
  }

  twitterSignInRetrieve () {
    TwitterActions.twitterSignInRetrieve();
  }

  render () {
    renderLog('TwitterSignInProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { jqueryLoading, hostname, mergingTwoAccounts, redirectInProgress, twitterAuthResponse } = this.state;
    // console.log('TwitterSignInProcess render, redirectInProgress:', redirectInProgress);
    if (jqueryLoading) {
      return (
        <div className="u-loading-spinner__wrapper">
          <div className="u-loading-spinner">Please wait, loading a library...</div>
        </div>
      );
    }
    // console.log('TwitterSignInProcess render, after jquery loading $', window.$.fn.jquery);

    if (redirectInProgress || !hostname || hostname === '') {
      return null;
    }

    oAuthLog('TwitterSignInProcess render');
    if (!twitterAuthResponse ||
      !twitterAuthResponse.twitter_retrieve_attempted) {
      oAuthLog('Pause, missing twitter_retrieve_attempted: twitterAuthResponse:', twitterAuthResponse);
      return (
        <SpinnerPage topWords="Waiting for a response from Twitter..." bottomWords="Please wait..." />
      );
    }
    oAuthLog('=== Passed initial gate === with twitterAuthResponse: ', twitterAuthResponse);
    const { twitter_secret_key: twitterSecretKey } = twitterAuthResponse;

    // Is there a collision of two accounts?
    if (twitterAuthResponse.existing_twitter_account_found) {
      // For now are not asking to merge accounts
      if (!mergingTwoAccounts) {
        oAuthLog('twitterAuthResponse voterMergeTwoAccountsByTwitterKey');
        this.voterMergeTwoAccountsByTwitterKey(twitterSecretKey);  // , twitterAuthResponse.voter_has_data_to_preserve
      } else {
        oAuthLog('twitterAuthResponse NOT CALLING voterMergeTwoAccountsByTwitterKey');
      }
      return (
        <SpinnerPage topWords="Loading your account..." bottomWords="Please wait..." />
      );
    } else {
      oAuthLog('Setting up new Twitter entry - voterTwitterSaveToCurrentAccount');
      this.voterTwitterSaveToCurrentAccount();
      return <CircularProgress />;
    }
  }
}
TwitterSignInProcess.propTypes = {
  setShowHeaderFooter: PropTypes.func,
};
