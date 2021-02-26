import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../utils/logging';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import MainFooter from '../components/Navigation/MainFooter';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';

const HomeCampaignList = React.lazy(() => import('../components/Home/HomeCampaignList'));

class HomePage extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('HomePage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`HomePage window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    return (
      <div>
        <Helmet title="Home - We Vote Campaigns" />
        <MainHeaderBar />
        <PageWrapper cordova={isCordova()}>
          <IntroductionMessageSection>
            <PageStatement>Helping the best candidates win votes</PageStatement>
            <PageSubStatement>Vote for candidates you like. Oppose candidates you don&apos;t.</PageSubStatement>
            <Button
              classes={{ root: classes.buttonRoot }}
              color="primary"
              variant="contained"
              onClick={() => historyPush('/start-a-campaign')}
            >
              Start a campaign
            </Button>
          </IntroductionMessageSection>
          <WhatIsHappeningSection>
            <WhatIsHappeningTitle>
              What&apos;s happening on WeVote.US
            </WhatIsHappeningTitle>
            <HomeCampaignList />
          </WhatIsHappeningSection>
        </PageWrapper>
        <MainFooter />
      </div>
    );
  }
}
HomePage.propTypes = {
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
  padding: 3em 0;
  display: flex;
  flex-flow: column;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1em 0;
  }
`;

const PageStatement = styled.h1`
  font-size: 42px;
  text-align: center;
  margin: 1em 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 28px;
  }
`;

const PageSubStatement = styled.div`
  color: #555;
  font-size: 18px;
  text-align: center;
  margin: 0 2em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 16px;
    margin: 0 1em 1em;
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

const WhatIsHappeningSection = styled.div`
  margin: 0 0 25px 0;
`;

const WhatIsHappeningTitle = styled.h3`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(HomePage);
