import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';
import WelcomeFooter from '../components/Navigation/WelcomeFooter';
import { isCordova } from '../utils/cordovaUtils';
import { lazyLoader, libraryNeedsLoading } from '../utils/lazyLoader';
import { renderLog } from '../utils/logging';


class Membership extends Component {
  constructor (props) {
    super(props);

    const library = 'stripe';
    this.state = {
      stripeLoaded: !libraryNeedsLoading(library),
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    const library = 'stripe';
    if (!this.state.stripeLoaded) {
      lazyLoader(library)
        .then((result) => {
          console.log('lazy loader for stripe returned: ', result);
          this.setState({ stripeLoaded: true }); // to force a reload
        });
    }
  }


  render () {
    const { classes } = this.props;
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
          <ContributeGridWrapper>
            <ContributeMonthlyText>
              Contribute Monthly:
            </ContributeMonthlyText>
            <ContributeGridSection>
              <ContributeGridItem>
                <Button classes={{ root: classes.buttonRoot }} color="primary" variant="contained">
                  $3
                </Button>
              </ContributeGridItem>
              <ContributeGridItem>
                <Button classes={{ root: classes.buttonRoot }} color="primary" variant="contained">
                  $5
                </Button>
              </ContributeGridItem>
              <ContributeGridItem>
                <Button classes={{ root: classes.buttonRoot }} color="primary" variant="contained">
                  $10
                </Button>
              </ContributeGridItem>
              <ContributeGridItem>
                <Button classes={{ root: classes.buttonRoot }} color="primary" variant="contained">
                  $20
                </Button>
              </ContributeGridItem>
              <ContributeGridItemJoin>
                <Button classes={{ root: classes.buttonRoot }} color="primary" variant="contained" style={{ width: '100%', backgroundColor: 'darkblue', color: 'white' }}>
                  Join
                </Button>
              </ContributeGridItemJoin>
            </ContributeGridSection>
          </ContributeGridWrapper>
        </PageWrapper>
        <WelcomeFooter />
      </div>
    );
  }
}
Membership.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    fontSize: 18,
    textTransform: 'none',
    width: '100%',
    color: 'black',
    backgroundColor: 'white',
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

const ContributeGridWrapper = styled.div`
  background-color: #ebebeb;
  padding: 10px;
  border: 1px solid darkgrey;
  margin: auto auto 20px auto;
  max-width: 500px;
`;

const ContributeGridSection = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  background-color: #ebebeb;
  padding: 10px 10px 2px 10px;
`;

const ContributeMonthlyText = styled.div`
  font-weight: 600;
  padding: 0 0 2px 18px;
`;

const ContributeGridItem = styled.div`
  background-color: #ebebeb;
  padding: 5px 10px;
  font-size: 30px;
  text-align: center;
`;

const ContributeGridItemJoin = styled.div`
  background-color: #ebebeb;
  padding: 5px 10px;
  font-size: 30px;
  text-align: center;
  grid-column: auto / span 2;
`;

export default withStyles(styles)(Membership);
