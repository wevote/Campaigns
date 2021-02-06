import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../utils/logging';
import { isCordova } from '../utils/cordovaUtils';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';
import WelcomeFooter from '../components/Navigation/WelcomeFooter';

class Membership extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('Membership');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`Membership window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    return (
      <div>
        <Helmet title="Membership - We Vote Campaigns" />
        <MainHeaderBar />
        <PageWrapper cordova={isCordova()}>
          <IntroductionMessageSection>
            <PageStatement>Become a WeVote.US member</PageStatement>
            <PageSubStatement>
              Voters come to WeVote.uS to start and sign campaigns that encourage more people to vote.
              Leading up to election day, review your ballot on WeVote.US, and discuss what is on your
              ballot with your friends.
              Become a member today and fuel our mission to help EVERY American to vote.
            </PageSubStatement>
          </IntroductionMessageSection>
        </PageWrapper>
        <WelcomeFooter />
      </div>
    );
  }
}
// Membership.propTypes = {
//   classes: PropTypes.object,
// };

const styles = () => ({
  buttonRoot: {
    fontSize: 18,
    textTransform: 'none',
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
  text-align: left;
  margin: 0 0 0.5em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const PageSubStatement = styled.div`
  font-size: 18px;
  text-align: left;
  margin: 0 0 1em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const PageWrapper = styled.div`
  margin: 0 15px;
  @media (max-width: ${({ theme, cordova }) => (cordova ? undefined : theme.breakpoints.md)}) {
  }
`;



export default withStyles(styles)(Membership);
