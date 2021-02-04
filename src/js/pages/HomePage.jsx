import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../utils/logging';
import { historyPush, isCordova } from '../utils/cordovaUtils';

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
        <Wrapper cordova={isCordova()}>
          <IntroductionMessageSection>
            <PageStatement>America wins when more voters participate.</PageStatement>
            <PageSubStatement>Trying to win a race on election day?</PageSubStatement>
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
        </Wrapper>
      </div>
    );
  }
}
HomePage.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

const IntroductionMessageSection = styled.div`
  padding: 3em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1em;
  }
`;

const PageStatement = styled.h1`
  font-size: 32px;
  text-align: center;
  margin: 1em 2em 3em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: .5em;
  }
`;

const PageSubStatement = styled.div`
  font-size: 18px;
  text-align: center;
  margin: 0 2em 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 2em 1em;
  }
`;

const WhatIsHappeningSection = styled.div`
  margin: 0 15px 25px 0;
`;

const WhatIsHappeningTitle = styled.h3`
  font-size: 22px;
  text-align: left;
`;

const Wrapper = styled.div`
  margin: 0 15px;
  @media (max-width: ${({ theme, cordova }) => (cordova ? undefined : theme.breakpoints.md)}) {
  }
`;

export default withStyles(styles)(HomePage);
