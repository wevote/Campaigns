import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CampaignListTabs from '../components/Navigation/CampaignListTabs';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import MainFooter from '../components/Navigation/MainFooter';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';
import { renderLog } from '../utils/logging';
import SettingsCampaignList from '../components/Settings/SettingsCampaignList';

class SettingsYourCampaigns extends Component {
  static getProps () {
    return {};
  }

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    renderLog('SettingsYourCampaigns');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SettingsYourCampaigns window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    return (
      <div>
        <Helmet title="Your Campaigns - We Vote Campaigns" />
        <MainHeaderBar />
        <PageWrapper cordova={isCordova()}>
          <IntroductionMessageSection>
            <YourNameWrapper>Your Name</YourNameWrapper>
            <YourLocationWrapper>Your Location</YourLocationWrapper>
            <Button
              classes={{ root: classes.buttonRoot }}
              color="primary"
              id="campaignListEditProfile"
              variant="outlined"
              onClick={() => historyPush('/')}
            >
              Edit Profile
            </Button>
          </IntroductionMessageSection>
          <CampaignListTabs />
          <SettingsCampaignList />
        </PageWrapper>
        <MainFooter />
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
