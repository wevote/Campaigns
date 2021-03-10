import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CampaignListTabs from '../../components/Navigation/CampaignListTabs';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import SettingsCampaignList from '../../components/Settings/SettingsCampaignList';
import VoterStore from '../../stores/VoterStore';

class SettingsYourCampaigns extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('VoterFirstNameInputField, componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const voterFirstPlusLastName = VoterStore.getFirstPlusLastName();
    this.setState({
      voterFirstPlusLastName,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterFirstPlusLastName = VoterStore.getFirstPlusLastName();
    this.setState({
      voterFirstPlusLastName,
    });
  }

  render () {
    renderLog('SettingsYourCampaigns');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SettingsYourCampaigns window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const { voterFirstPlusLastName } = this.state;
    return (
      <div>
        <Helmet title="Your Campaigns - We Vote Campaigns" />
        <PageWrapper cordova={isCordova()}>
          <IntroductionMessageSection>
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

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

export default withStyles(styles)(SettingsYourCampaigns);
