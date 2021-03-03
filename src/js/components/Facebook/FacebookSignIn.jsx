import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FacebookActions from '../../actions/FacebookActions';
import VoterActions from '../../actions/VoterActions';
import AppStore from '../../stores/AppStore';
import FacebookStore from '../../stores/FacebookStore';
import VoterStore from '../../stores/VoterStore';
import { oAuthLog, renderLog } from '../../utils/logging';
import signInModalGlobalState from '../Settings/signInModalGlobalState';
import SplitIconButton from '../Widgets/SplitIconButton';


class FacebookSignIn extends Component {
  constructor (props) {
    super(props);
    this.state = {
      facebookSignInSequenceStarted: false,
      redirectInProgress: false,
      saving: false,
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount () {
    // console.log('FacebookSignIn, componentDidMount');
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.appStoreListener = AppStore.addListener(this.onVoterStoreChange.bind(this));
    signInModalGlobalState.set('facebookSignInStep', '');
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
    this.appStoreListener.remove();
  }

  onFacebookStoreChange () {
    // console.log('FacebookSignIn onFacebookStoreChange');
    // const fbState = signInModalGlobalState.getAll();  // For debug
    const facebookAuthResponse = FacebookStore.getFacebookAuthResponse();

    if (signInModalGlobalState.get('facebookSignInStep') === 'getVotersFacebookData') {
      console.log('FacebookSignIn sending getFacebookData after FB.login');
      signInModalGlobalState.set('facebookSignInStatus', 'Retrieving Facebook additional data...');
      FacebookActions.getVoterInfoFromFacebookAPI();
      signInModalGlobalState.set('facebookSignInStep', 'saveWhatWeHaveToFB');
    } else if (signInModalGlobalState.get('facebookSignInStep') === 'saveWhatWeHaveToFB') {
      FacebookActions.voterFacebookSignInData(FacebookStore.getFacebookAuthData());
      signInModalGlobalState.set('facebookSignInStep', 'retrieveSecretKey');
    } else if (signInModalGlobalState.get('facebookSignInStep') === 'retrieveSecretKey') {
      FacebookActions.voterFacebookSignInRetrieve();  // get the secret key
      signInModalGlobalState.set('facebookSignInStep', 'checkForNeedToMerge');
      signInModalGlobalState.set('facebookSignInStatus', 'Retrieving sign in data...');
    } else if (signInModalGlobalState.get('facebookSignInStep') === 'checkForNeedToMerge') {
      const { existing_facebook_account_found: existingFBAccountFound } = facebookAuthResponse;
      if (existingFBAccountFound) {
        console.log('FacebookSignIn calling voterMergeTwoAccountsByFacebookKey, since the voter is authenticated with facebook');
        signInModalGlobalState.set('facebookSignInStatus', 'Merging any changes made when not signed in...');
        const { facebook_secret_key: facebookSecretKey } = facebookAuthResponse;
        VoterActions.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);
      } else {
        console.log('FacebookSignIn calling voterFacebookSaveToCurrentAccount, since this is the first time this voter signed in with facebook');
        signInModalGlobalState.set('facebookSignInStatus', 'Saving initial Facebook signin...');
        VoterActions.voterFacebookSaveToCurrentAccount();
      }
      signInModalGlobalState.set('facebookSignInStep', 'voterRefresh');
    } else if (signInModalGlobalState.get('facebookSignInStep') === 'voterRefresh') {
      console.log('FacebookSignIn facebookSignInStep === voterRefresh and calling voterRetrieve()');
      signInModalGlobalState.set('facebookSignInStep', 'waitingForRetrieveVoterResponse');
      VoterActions.voterRetrieve();
    }
  }

  onVoterStoreChange () {
    // const fbState = signInModalGlobalState.getAll();  // For debug
    // const voter = VoterStore.getVoter();  // for debug
    // console.log('FacebookSignIn onVoterStoreChange       voter:', voter);
    if (signInModalGlobalState.get('facebookSignInStep') === 'waitingForRetrieveVoterResponse') {
      console.log('onVoterStoreChange ... facebookSignInStep === waitingForRetrieveVoterResponse');
      signInModalGlobalState.set('facebookSignInStep', 'done');
      this.closeSignInModalLocal();
    } else if (signInModalGlobalState.get('facebookSignInStep') === 'voterRefresh') {
      // The FacebookStore was not involved in this step, so need to involve it
      this.onFacebookStoreChange();
    }
  }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.didClickFacebookSignInButton();
    }
  };

  didClickFacebookSignInButton = () => {
    this.setState({
      facebookSignInSequenceStarted: true,
    });
    FacebookActions.login();
  };

  closeSignInModalLocal = () => {
    if (this.props.closeSignInModal) {
      console.log('FacebookSignIn closeSignInModalLocal closing dialog ---------------');
      this.props.closeSignInModal();
    }
  };

  voterFacebookSignInRetrieve () {
    oAuthLog('FacebookSignIn voterFacebookSignInRetrieve');
    if (!this.state.saving) {
      FacebookActions.voterFacebookSignInRetrieve();
      this.setState({
        saving: true,
      });
    }
  }

  render () {
    renderLog('FacebookSignIn');  // Set LOG_RENDER_EVENTS to log all renders
    const { buttonSubmittedText, buttonText } = this.props;
    const { facebookSignInSequenceStarted, redirectInProgress } = this.state;
    const facebookAuthResponse = FacebookStore.getFacebookAuthResponse();
    // const fbState = signInModalGlobalState.getAll();     // For debug
    if (redirectInProgress) {
      return null;
    }

    let showWheel = true;

    if (facebookAuthResponse && facebookAuthResponse.facebook_sign_in_failed) {
      oAuthLog('facebookAuthResponse.facebook_sign_in_failed , setting "Facebook sign in process." message.');
      signInModalGlobalState.set('facebookSignInStatus', 'Facebook sign in process.');
    } else if (facebookAuthResponse && facebookAuthResponse.facebook_sign_in_found === false) {
      // This process starts when we return from attempting voterFacebookSignInRetrieve.  If facebook_sign_in_found NOT True, try again
      oAuthLog('facebookAuthResponse.facebook_sign_in_found with no authentication');
      signInModalGlobalState.set('facebookSignInStatus', 'Facebook authentication not found. Please try again.');
      showWheel = false;
    } else if (signInModalGlobalState.get('facebookSignInStep') === 'voterRefresh' ||
      signInModalGlobalState.get('facebookSignInStep') === 'waitingForRetrieveVoterResponse') {
      oAuthLog('FacebookSignin voterRetrieve, which should bring in the merged voter');
    } else if (facebookAuthResponse && facebookAuthResponse.existing_facebook_account_found) {  // Is there a collision of two accounts?
      oAuthLog('FacebookSignIn facebookAuthResponse.existing_facebook_account_found');
      if (signInModalGlobalState.get('facebookSignInStep') === 'retrieveSecretKey' ||
        signInModalGlobalState.get('facebookSignInStep') === 'checkForNeedToMerge') {
        oAuthLog('FacebookSignIn merging two accounts by facebook key');
      } else {
        oAuthLog('FacebookSignIn internal error ---------------');
        signInModalGlobalState.set('facebookSignInStatus', 'Internal error...');
      }
    }
    // } else {
    //   oAuthLog('Setting up new Facebook entry - voterFacebookSaveToCurrentAccount');
    //   this.voterFacebookSaveToCurrentAccount();
    //   signInModalGlobalState.set('facebookSignInStatus', 'Saving your account...');
    // }

    const statusMessage = signInModalGlobalState.get('facebookSignInStatus') || '';
    // console.log('FacebookSignIn immediately before render, statusMessage:', statusMessage);
    return (
      <div>
        <SplitIconButton
          buttonText={facebookSignInSequenceStarted ? buttonSubmittedText : buttonText}
          backgroundColor="#3b5998"
          disabled={facebookSignInSequenceStarted}
          externalUniqueId="facebookSignIn"
          icon={<span className="fab fa-facebook-square" />}
          id="facebookSignIn"
          onClick={this.didClickFacebookSignInButton}
          onKeyDown={this.onKeyDown}
          separatorColor="rgba(250, 250, 250, .6)"
        />
        { statusMessage.length ? (
          <FacebookErrorContainer>
            <div style={{ textAlign: 'center' }}>
              {statusMessage}
            </div>
            { showWheel ? (
              <>
                <CircularProgress style={{ margin: 8 }} />
                <div>Please wait...</div>
              </>
            ) : null}
          </FacebookErrorContainer>
        ) : null}
      </div>
    );
  }
}
FacebookSignIn.propTypes = {
  closeSignInModal: PropTypes.func,
  buttonSubmittedText: PropTypes.string,
  buttonText: PropTypes.string,
};

export default FacebookSignIn;

const FacebookErrorContainer  = styled.h3`
  margin-top: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`;
