import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import CampaignListTabs from '../../components/Navigation/CampaignListTabs';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import SettingsCampaignList from '../../components/Settings/SettingsCampaignList';
import VoterStore from '../../stores/VoterStore';


class SettingsYourCampaigns extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);
    this.state = {
      chosenWebsiteName: '',
      voterFirstPlusLastName: '',
      voterPhotoUrlLarge: '',
    };
  }

  componentDidMount () {
    // console.log('VoterFirstNameInputField, componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onVoterStoreChange () {
    const voterFirstPlusLastName = VoterStore.getFirstPlusLastName();
    const voterPhotoTooBig = VoterStore.getVoterPhotoTooBig();
    const voterPhotoUrlLarge = VoterStore.getVoterPhotoUrlLarge();
    this.setState({
      voterFirstPlusLastName,
      voterPhotoTooBig,
      voterPhotoUrlLarge,
    });
  }

  render () {
    renderLog('SettingsYourCampaigns');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName, voterFirstPlusLastName, voterPhotoTooBig, voterPhotoUrlLarge } = this.state;
    return (
      <div>
        <Helmet title={`Your Campaigns - ${chosenWebsiteName}`} />
        <PageWrapper>
          <IntroductionMessageSection>
            {voterPhotoUrlLarge && (
              <VoterPhotoWrapper>
                <VoterPhotoImage src={voterPhotoUrlLarge} alt="Profile Photo" />
              </VoterPhotoWrapper>
            )}
            <YourNameWrapper>{voterFirstPlusLastName || 'Your profile'}</YourNameWrapper>
            <YourLocationWrapper>&nbsp;</YourLocationWrapper>
            <Button
              classes={{ root: classes.buttonRoot }}
              color="primary"
              id="campaignListEditProfile"
              variant="outlined"
              onClick={() => historyPush('/edit-profile')}
            >
              Edit profile
            </Button>
            {voterPhotoTooBig && (
              <VoterPhotoTooBig>
                The profile photo you tried to save is too big and cannot be saved. The size limit is 5 Megabytes. None of your changes were saved. Please click &apos;Edit profile&apos; and try again.
              </VoterPhotoTooBig>
            )}
          </IntroductionMessageSection>
          <CampaignListTabs />
          <SettingsCampaignList />
        </PageWrapper>
      </div>
    );
  }
}
SettingsYourCampaigns.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    fontSize: 18,
    textTransform: 'none',
    width: 250,
  },
});

const IntroductionMessageSection = styled.div`
  padding: 3em 0 1em 0;
  display: flex;
  flex-flow: column;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1em 0 .5em 0;
  }
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const VoterPhotoImage = styled.img`
  border-radius: 100px;
  max-width: 200px;
`;

const VoterPhotoTooBig = styled.div`
  background-color: #efc2c2;
  border-radius: 4px;
  color: #2e3c5d;
  font-size: 18px;
  margin-bottom: 20px;
  margin-top: 20px;
  padding: 5px 12px;
`;

const VoterPhotoWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 15px;
  width: 100%;
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

const YourLocationWrapper = styled.div`
  color: #555;
  font-size: 18px;
  text-align: center;
  margin: 20px 2em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
    margin: 20px 1em 1em;
  }
`;

export default withStyles(styles)(SettingsYourCampaigns);
