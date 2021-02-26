import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AppActions from '../../actions/AppActions';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import MainFooter from '../../components/Navigation/MainFooter';
import MainHeaderBar from '../../components/Navigation/MainHeaderBar';
import { renderLog } from '../../utils/logging';
import VoterActions from '../../actions/VoterActions';
import VoterFirstNameInputField from '../../components/Settings/VoterFirstNameInputField';
import VoterLastNameInputField from '../../components/Settings/VoterLastNameInputField';
import VoterStore from '../../stores/VoterStore';

class SettingsEditProfile extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    if (!voterIsSignedIn) {
      AppActions.setShowSignInModal(true);
    }
  }

  cancelEditProfile = () => {
    historyPush('/profile/started');
  }

  submitEditYourProfile = () => {
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
    historyPush('/profile/started');
  }

  render () {
    renderLog('SettingsEditProfile');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SettingsEditProfile window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    return (
      <div>
        <Helmet title="Edit Your Profile - We Vote Campaigns" />
        <MainHeaderBar />
        <SaveCancelOuterWrapper>
          <SaveCancelInnerWrapper>
            <SaveCancelButtonsWrapper>
              <Button
                classes={{ root: classes.buttonCancel }}
                color="primary"
                id="cancelEditProfileTop"
                onClick={this.cancelEditProfile}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                classes={{ root: classes.buttonSave }}
                color="primary"
                id="saveEditYourProfileTop"
                onClick={this.submitEditYourProfile}
                variant="contained"
              >
                Save
              </Button>
            </SaveCancelButtonsWrapper>
          </SaveCancelInnerWrapper>
        </SaveCancelOuterWrapper>
        <PageWrapper cordova={isCordova()}>
          <IntroductionMessageSection>
            <YourNameWrapper>Edit your profile</YourNameWrapper>
          </IntroductionMessageSection>
          <InputFieldsWrapper>
            <OneInputFieldWrapper>
              <VoterFirstNameInputField showLabel />
            </OneInputFieldWrapper>
            <OneInputFieldWrapper>
              <VoterLastNameInputField showLabel />
            </OneInputFieldWrapper>
          </InputFieldsWrapper>
          <SaveOuterWrapper>
            <SaveInnerWrapper>
              <Button
                classes={{ root: classes.buttonSave }}
                color="primary"
                id="saveEditYourProfileBottom"
                onClick={this.submitEditYourProfile}
                variant="contained"
              >
                Save
              </Button>
            </SaveInnerWrapper>
          </SaveOuterWrapper>
        </PageWrapper>
        <MainFooter />
      </div>
    );
  }
}
SettingsEditProfile.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonCancel: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 30px',
    textTransform: 'none',
    width: 100,
  },
  buttonSave: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    marginLeft: 10,
    padding: '0 30px',
    textTransform: 'none',
    width: 150,
  },
  buttonRoot: {
    fontSize: 18,
    textTransform: 'none',
    width: 250,
  },
});

const InputFieldsWrapper = styled.div`
  margin-top: 25px;
`;

const IntroductionMessageSection = styled.div`
  padding: 1em 0 1em 0;
  display: flex;
  flex-flow: column;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1em 0 .5em 0;
  }
`;

const OneInputFieldWrapper = styled.div`
  margin-bottom: 25px;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 640px;
  @media (max-width: 670px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const SaveCancelButtonsWrapper = styled.div`
  display: flex;
`;

const SaveCancelInnerWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
  max-width: 960px;
  padding: 8px 0;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const SaveCancelOuterWrapper = styled.div`
  background-color: #f6f4f6;
  border-bottom: 1px solid #ddd;
  // margin: 10px 0;
  width: 100%;
`;

const SaveInnerWrapper = styled.div`
  display: flex;
`;

const SaveOuterWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
`;

const YourNameWrapper = styled.h1`
  font-size: 42px;
  text-align: center;
  margin: 1em 0 0 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 28px;
    // margin: 25px;
  }
`;

export default withStyles(styles)(SettingsEditProfile);
