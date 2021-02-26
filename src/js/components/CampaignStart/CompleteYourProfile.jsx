import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import { historyPush } from '../../utils/cordovaUtils';
import initializejQuery from '../../utils/initializejQuery';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import { renderLog } from '../../utils/logging';
import SettingsVerifySecretCode from '../Settings/SettingsVerifySecretCode';
import VoterActions from '../../actions/VoterActions';
import VoterEmailInputField from '../Settings/VoterEmailInputField';
import VoterFirstNameInputField from '../Settings/VoterFirstNameInputField';
import VoterLastNameInputField from '../Settings/VoterLastNameInputField';
import VoterStore from '../../stores/VoterStore';


class CompleteYourProfile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showVerifyModal: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    initializejQuery();
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CompleteYourProfile caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('CompleteYourProfile componentWillUnmount');
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in CompleteYourProfile: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onVoterStoreChange () {
    const emailAddressStatus = VoterStore.getEmailAddressStatus();
    // const { secret_code_system_locked_for_this_voter_device_id: secretCodeSystemLocked } = emailAddressStatus;
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    // console.log('onVoterStoreChange emailAddressStatus:', emailAddressStatus);

    const voter = VoterStore.getVoter();
    const { signed_in_with_email: voterIsSignedInWithEmail } = voter;
    // console.log(`VoterEmailAddressEntry onVoterStoreChange isSignedIn: ${isSignedIn}, voterIsSignedInWithEmail: ${voterIsSignedInWithEmail}`);
    if (voterIsSignedInWithEmail) {
      // console.log('VoterEmailAddressEntry onVoterStoreChange voterIsSignedInWithEmail');
    } else if (secretCodeVerified) {
      this.setState({
        showVerifyModal: false,
        voterEmailQueuedToSaveLocal: '',
      });
      historyPush('/profile/started');
    } else if (emailAddressStatus.sign_in_code_email_sent) {
      this.setState({
        showVerifyModal: true,
      });
    } else if (emailAddressStatus.email_address_already_owned_by_this_voter) {
      this.setState({
        showVerifyModal: false,
      });
    } else {
      this.setState({
      });
    }
    // const voterEmailAddressesVerifiedCount = VoterStore.getEmailAddressesVerifiedCount();
    this.setState({
      // secretCodeSystemLocked,
      voter: VoterStore.getVoter(),
    });
  }

  closeVerifyModal = () => {
    // console.log('VoterEmailAddressEntry closeVerifyModal');
    VoterActions.clearEmailAddressStatus();
    VoterActions.clearSecretCodeVerificationStatus();
    this.setState({
      showVerifyModal: false,
    });
  };

  onKeyDown = (event) => {
    event.preventDefault();
  };

  submitCompleteYourProfile = (event) => {
    let voterEmailMissing = false;
    let voterFirstNameMissing = false;
    let voterLastNameMissing = false;
    const voterFirstNameQueuedToSave = VoterStore.getVoterFirstNameQueuedToSave();
    const voterFirstNameQueuedToSaveSet = VoterStore.getVoterFirstNameQueuedToSaveSet();
    const voterLastNameQueuedToSave = VoterStore.getVoterLastNameQueuedToSave();
    const voterLastNameQueuedToSaveSet = VoterStore.getVoterLastNameQueuedToSaveSet();
    if (voterFirstNameQueuedToSaveSet && voterLastNameQueuedToSaveSet) {
      VoterActions.voterCompleteYourProfileSave(voterFirstNameQueuedToSave, voterLastNameQueuedToSave);
      VoterActions.voterFirstNameQueuedToSave(undefined);
      VoterActions.voterLastNameQueuedToSave(undefined);
    } else if (voterFirstNameQueuedToSaveSet) {
      VoterActions.voterCompleteYourProfileSave(voterFirstNameQueuedToSave);
      VoterActions.voterFirstNameQueuedToSave(undefined);
    } else if (voterLastNameQueuedToSaveSet) {
      VoterActions.voterCompleteYourProfileSave(false, voterLastNameQueuedToSave);
      VoterActions.voterLastNameQueuedToSave(undefined);
    }
    const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    const voterEmailQueuedToSave = VoterStore.getVoterEmailQueuedToSave();
    // const voterEmailQueuedToSaveSet = VoterStore.getVoterEmailQueuedToSaveSet();
    if (!voterIsSignedInWithEmail && !voterEmailQueuedToSave) {
      voterEmailMissing = true;
    } else if (voterEmailQueuedToSave) {
      // Check to see if valid email format
      // if so,
      this.setState({
        voterEmailQueuedToSaveLocal: voterEmailQueuedToSave,
      });
    }
    if (!voterFirstNameQueuedToSave && !VoterStore.getFirstName()) {
      voterFirstNameMissing = true;
    }
    if (!voterLastNameQueuedToSave && !VoterStore.getLastName()) {
      voterLastNameMissing = true;
    }
    if (voterEmailMissing || voterFirstNameMissing || voterLastNameMissing) {
      this.setState({
        voterEmailMissing,
        voterFirstNameMissing,
        voterLastNameMissing,
      });
    } else if (!voterIsSignedInWithEmail) {
      // All required fields were found
      this.sendSignInCodeEmail(event, voterEmailQueuedToSave);
      // historyPush('/who-do-you-want-to-see-elected');
    } else {
      historyPush('/profile/started');
    }
  }

  sendSignInCodeEmail = (event, voterEmailQueuedToSaveLocal) => {
    if (event) {
      event.preventDefault();
    }
    console.log('voterEmailQueuedToSaveLocal: ', voterEmailQueuedToSaveLocal);
    VoterActions.sendSignInCodeEmail(voterEmailQueuedToSaveLocal);
  };

  render () {
    renderLog('CompleteYourProfile');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    const {
      showVerifyModal, voter, voterEmailMissing,
      voterFirstNameMissing, voterLastNameMissing, voterEmailQueuedToSaveLocal,
    } = this.state;
    if (!voter) {
      // console.log('CompleteYourProfile render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('CompleteYourProfile render voter found');
    return (
      <Wrapper>
        <section>
          <DialogContentDescription>
            Let people you know see you, so they can feel safe supporting your campaign.
          </DialogContentDescription>
          <InputFieldsWrapper>
            <VoterFirstNameInputField voterFirstNameMissing={voterFirstNameMissing} />
            <VoterLastNameInputField voterLastNameMissing={voterLastNameMissing} />
            <VoterEmailInputField voterEmailMissing={voterEmailMissing} />
          </InputFieldsWrapper>
          <ButtonWrapper>
            <Button
              classes={{ root: classes.buttonDesktop }}
              color="primary"
              id="saveCompleteYourProfile"
              onClick={this.submitCompleteYourProfile}
              variant="contained"
            >
              Continue
            </Button>
          </ButtonWrapper>
          <FinePrint>
            By continuing, you accept WeVote.US&apos;s
            {' '}
            <OpenExternalWebSite
              linkIdAttribute="termsOfService"
              url="https://wevote.us/more/terms"
              target="_blank"
              body={(
                <span>Terms of Service</span>
              )}
              className={classes.link}
            />
            {' '}
            and
            {' '}
            <OpenExternalWebSite
              linkIdAttribute="privacyPolicy"
              url="https://wevote.us/more/privacy"
              target="_blank"
              body={(
                <span>Privacy Policy</span>
              )}
              className={classes.link}
            />
            {' '}
            and agree to receive occasional emails about your campaign and upcoming elections. You can unsubscribe at any time. We will never sell your email address.
          </FinePrint>
        </section>
        {showVerifyModal && (
          <SettingsVerifySecretCode
            show={showVerifyModal}
            closeVerifyModal={this.closeVerifyModal}
            voterEmailAddress={voterEmailQueuedToSaveLocal}
          />
        )}
      </Wrapper>
    );
  }
}
CompleteYourProfile.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonDesktop: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  link: {
    color: '#999',
    '&:hover': {
      color: '#4371cc',
    },
  },
});

const ButtonWrapper = styled.div`
  background-color: #fff;
  margin: 35px 15px 0 15px;
  padding: 10px 0;
`;

const DialogContentDescription = styled.div`
  font-size: 15px;
  margin: 10px 15px;
`;

const FinePrint = styled.div`
  color: #999;
  font-size: 13px;
  margin: 10px 15px 15px 15px;
`;

const InputFieldsWrapper = styled.div`
  margin: 0 15px !important;
`;

const Wrapper = styled.div`
`;

export default withTheme(withStyles(styles)(CompleteYourProfile));
