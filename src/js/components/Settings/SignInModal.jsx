import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { isWebAppHeight0to568, isWebAppHeight569to667, isWebAppHeight668to736, isWebAppHeight737to896 } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import initializejQuery from '../../common/utils/initializejQuery';
import { lazyLoader, libraryNeedsLoading } from '../../utils/lazyLoader';
import SettingsAccount from './SettingsAccount';
import signInModalGlobalState from './signInModalGlobalState';


class SignInModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      focusedOnSingleInputToggle: false,
    };
    signInModalGlobalState.set('textOrEmailSignInInProcess', false);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    initializejQuery();
    const library = 'fontawesome';
    if (libraryNeedsLoading(library)) {
      lazyLoader(library)
        .then((result) => {
          // console.log('lazy loader for fontawesome returned: ', result);
          // eslint-disable-next-line react/no-unused-state
          this.setState({ result }); // to force a reload
        });
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('SignInModal caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('SignInModal componentWillUnmount');
    signInModalGlobalState.set('textOrEmailSignInInProcess', false);
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in SignInModal: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onVoterStoreChange () {
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    if (secretCodeVerified) {
      this.closeFunction();
    } else {
      const voter = VoterStore.getVoter();
      this.setState({
        voter,
        voterIsSignedIn: voter.is_signed_in,
      });
    }
  }

  focusedOnSingleInputToggle = (focusedInputName) => {
    const { focusedOnSingleInputToggle } = this.state;
    // console.log('focusedInputName:', focusedInputName);
    const incomingInputName = focusedInputName === 'email' ? 'email' : 'phone';
    this.setState({
      focusedInputName: incomingInputName,
      focusedOnSingleInputToggle: !focusedOnSingleInputToggle,
    });
  };

  closeFunction = () => {
    console.log('SignInModal closeFunction');
    signInModalGlobalState.set('textOrEmailSignInInProcess', false);
    AppObservableStore.setShowSignInModal(false);
    console.log('SignInModal closeFunction before force set state');
    this.setState({});
  };

  onKeyDown = (event) => {
    event.preventDefault();
    // const ENTER_KEY_CODE = 13;
    // const enterAndReturnKeyCodes = [ENTER_KEY_CODE];
    // if (enterAndReturnKeyCodes.includes(event.keyCode)) {
    //   this.closeFunction();
    // }
  };

  render () {
    renderLog('SignInModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const show = AppObservableStore.showSignInModal();

    const { focusedInputName, focusedOnSingleInputToggle, voter, voterIsSignedIn } = this.state;
    if (!voter) {
      // console.log('SignInModal render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('SignInModal render voter found');
    // console.log('SignInModal AppObservableStore.showSignInModal()', show);

    // This modal is shown when the voter wants to sign in.
    // console.log('window.screen.height:', window.screen.height);
    return (
      <Dialog
        id="signInModalDialog"
        classes={{
          paper: clsx(classes.dialogPaper, {
            [classes.focusedOnSingleInput]: focusedOnSingleInputToggle,
            // iPhone 5 / SE
            [classes.emailInputWebApp0to568]: isWebAppHeight0to568() && focusedOnSingleInputToggle && focusedInputName === 'email',
            [classes.phoneInputWebApp0to568]: isWebAppHeight0to568() && focusedOnSingleInputToggle && focusedInputName === 'phone',
            // iPhone6/7/8, iPhone8Plus
            [classes.emailInputWebApp569to736]: (isWebAppHeight569to667() || isWebAppHeight668to736()) && focusedOnSingleInputToggle && focusedInputName === 'email',
            [classes.phoneInputWebApp569to736]: (isWebAppHeight569to667() || isWebAppHeight668to736()) && focusedOnSingleInputToggle && focusedInputName === 'phone',
            // iPhoneX/iPhone11 Pro Max
            [classes.emailInputWebApp737to896]: isWebAppHeight737to896() && focusedOnSingleInputToggle && focusedInputName === 'email',
            [classes.phoneInputWebApp737to896]: isWebAppHeight737to896() && focusedOnSingleInputToggle && focusedInputName === 'phone',
          }),
          root: classes.dialogRoot,
        }}
        open={show}
        onClose={() => { this.closeFunction(); }}
      >
        <DialogTitle>
          <SignInText className="h2" style={{ paddingRight: 30 }}>
            Sign In
          </SignInText>
          <IconButton
            aria-label="Close"
            classes={{ root: classes.closeButton }}
            onClick={() => { this.closeFunction(); }}
            id="profileCloseSignInModal"
            size="large"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <section>
            <div className="text-center">
              {voter && voterIsSignedIn ? (
                <div>
                  <div className="u-f2">You are signed in.</div>
                </div>
              ) : (
                <div>
                  <SettingsAccount
                    closeSignInModal={this.closeFunction}
                    focusedOnSingleInputToggle={this.focusedOnSingleInputToggle}
                    inModal
                  />
                </div>
              )}
            </div>
          </section>
        </DialogContent>
      </Dialog>
    );
  }
}
SignInModal.propTypes = {
  classes: PropTypes.object,
};

/*
This modal dialog floats up in the DOM, to just below the body, so no styles from the app are inherited.
In Cordova, when you click into a text entry field, the phone OS reduces the size of the JavaScript DOM by
the size of the keyboard, and if the DOM is overconstrained, i.e  has hard coded vertical sizes that can't
be honored, Cordova tries to do the best it can, but sometimes it crashes and locks up the instance.
For Cordova eliminate as many fixed vertical dimensions as needed to avoid overconstraint.
*/
const styles = (theme) => ({
  dialogRoot: {
    height: '100%',
    // position: 'absolute !important', // Causes problem on Firefox
    top: '-15%',
    left: '0% !important',
    right: 'unset !important',
    bottom: 'unset !important',
    width: '100%',
    zIndex: '9010 !important',
  },
  dialogPaper: {
    [theme.breakpoints.down('sm')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      maxHeight: '90%',
      height: 'unset',
      margin: '0 auto',
    },
  },
  focusedOnSingleInput: {
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: '75%',
      left: '73%',
    },
  },
  phoneInputWebApp0to568: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -60%)',
    },
  },
  emailInputWebApp569to736: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -55%)',
    },
  },
  phoneInputWebApp569to736: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -55%)',
    },
  },
  emailInputWebApp737to896: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -40%)',
    },
  },
  phoneInputWebApp737to896: {
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(-75%, -55%)',
    },
  },
  signInModalDialogAndroid: {
    transform: 'translate(-50%, -60%)',
  },
  signInModalDialogLarger: {
    bottom: 'unset',
    top: '180px',
  },
  dialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: '0 8px 8px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
});

const SignInText = styled('span')`
  display: block;
  text-align: center;
  min-width: 200px;
`;

export default withTheme(withStyles(styles)(SignInModal));
