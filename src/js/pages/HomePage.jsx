import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';
import { renderLog } from '../common/utils/logging';
import historyPush from '../common/utils/historyPush';

const HomeCampaignList = React.lazy(() => import('../components/Home/HomeCampaignList'));

class HomePage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenWebsiteName: '',
      inPrivateLabelMode: false,
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('HeaderBarLogo componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    const inPrivateLabelMode = AppObservableStore.getHideWeVoteLogo(); // Using this setting temporarily
    const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      chosenWebsiteName,
      inPrivateLabelMode,
      siteConfigurationHasBeenRetrieved,
    });
  }

  render () {
    renderLog('HomePage');  // Set LOG_RENDER_EVENTS to log all renders
    // if (isCordova()) {
    //   console.log(`HomePage window.location.href: ${window.location.href}`);
    // }
    const { classes } = this.props;
    const { chosenWebsiteName, inPrivateLabelMode, siteConfigurationHasBeenRetrieved } = this.state;
    if (!siteConfigurationHasBeenRetrieved) {
      return null;
    }
    if (inPrivateLabelMode) {
      return (
        <div>
          <Helmet title={`Who We Support - ${chosenWebsiteName}`} />
          <PageWrapper>
            <IntroductionMessageSection>
              <PageStatement>Who We Support</PageStatement>
            </IntroductionMessageSection>
            <WhatIsHappeningSection>
              <Suspense fallback={<span>&nbsp;</span>}>
                <HomeCampaignList hideTitle />
              </Suspense>
            </WhatIsHappeningSection>
          </PageWrapper>
        </div>
      );
    } else {
      return (
        <div>
          <Helmet title="Home - WeVote.US Campaigns" />
          <PageWrapper>
            <IntroductionMessageSection>
              <PageStatement>Helping the best candidates win votes</PageStatement>
              <PageSubStatement>
                Support the candidates you like with your vote.
                {' '}
                <span className="u-show-desktop-tablet">
                  <br />
                </span>
                Oppose candidates you don&apos;t like.
                {' '}
                <span className="u-show-desktop-tablet">
                  <br />
                </span>
                Encourage votes instead of donations.
              </PageSubStatement>
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
              <Suspense fallback={<span>&nbsp;</span>}>
                <HomeCampaignList />
              </Suspense>
            </WhatIsHappeningSection>
          </PageWrapper>
        </div>
      );
    }
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

export default withStyles(styles)(HomePage);
