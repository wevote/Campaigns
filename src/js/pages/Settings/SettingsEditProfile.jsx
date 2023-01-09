import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import VoterActions from '../../actions/VoterActions';
import VoterPhotoUpload from '../../common/components/Settings/VoterPhotoUpload';
import { PageWrapper } from '../../common/components/Style/stepDisplayStyles';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import VoterFirstNameInputField from '../../common/components/Settings/VoterFirstNameInputField';
import VoterLastNameInputField from '../../common/components/Settings/VoterLastNameInputField';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';

class SettingsEditProfile extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);
    this.state = {
      // voterPhotoTooBig: false,
    };
  }

  componentDidMount () {
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    if (!voterIsSignedIn) {
      AppObservableStore.setShowSignInModal(true);
    }
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  cancelEditProfile = () => {
    historyPush('/profile/started');
  }

  submitEditYourProfile = () => {
    const voterFirstNameQueuedToSave = VoterStore.getVoterFirstNameQueuedToSave();
    const voterFirstNameQueuedToSaveSet = VoterStore.getVoterFirstNameQueuedToSaveSet();
    const voterLastNameQueuedToSave = VoterStore.getVoterLastNameQueuedToSave();
    const voterLastNameQueuedToSaveSet = VoterStore.getVoterLastNameQueuedToSaveSet();
    const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
    VoterActions.voterCompleteYourProfileSave(voterFirstNameQueuedToSave, voterFirstNameQueuedToSaveSet, voterLastNameQueuedToSave, voterLastNameQueuedToSaveSet, voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet);
    VoterActions.voterFirstNameQueuedToSave(undefined);
    VoterActions.voterLastNameQueuedToSave(undefined);
    VoterActions.voterPhotoQueuedToSave(undefined);
    VoterActions.voterPhotoTooBigReset();
    historyPush('/profile/started');
  }

  render () {
    renderLog('SettingsEditProfile');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    return (
      <div>
        <Helmet title={`Edit Your Profile - ${chosenWebsiteName}`} />
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
        <PageWrapper>
          <IntroductionMessageSection>
            <YourNameWrapper>Edit your profile</YourNameWrapper>
          </IntroductionMessageSection>
          <InputFieldsWrapper>
            <OneInputFieldWrapper>
              <VoterPhotoUpload />
            </OneInputFieldWrapper>
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

const InputFieldsWrapper = styled('div')`
  margin-top: 25px;
`;

const IntroductionMessageSection = styled('div')(({ theme }) => (`
  padding: 1em 0 1em 0;
  display: flex;
  flex-flow: column;
  align-items: center;
  ${theme.breakpoints.down('md')} {
    padding: 1em 0 .5em 0;
  }
`));

const OneInputFieldWrapper = styled('div')`
  margin-bottom: 25px;
`;

const SaveCancelButtonsWrapper = styled('div')`
  display: flex;
`;

const SaveCancelInnerWrapper = styled('div')`
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

const SaveCancelOuterWrapper = styled('div')`
  background-color: #f6f4f6;
  border-bottom: 1px solid #ddd;
  // margin: 10px 0;
  width: 100%;
`;

const SaveInnerWrapper = styled('div')`
  display: flex;
`;

const SaveOuterWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
`;

const YourNameWrapper = styled('h1')(({ theme }) => (`
  font-size: 42px;
  text-align: center;
  margin: 1em 0 0 0;
  ${theme.breakpoints.down('md')} {
    font-size: 28px;
    // margin: 25px;
  }
`));

export default withStyles(styles)(SettingsEditProfile);
