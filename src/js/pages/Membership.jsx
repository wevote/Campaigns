import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import { Button, InputAdornment, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import DonationListForm from '../common/components/Donation/DonationListForm';
import LoadingWheel from '../components/LoadingWheel';
import InjectedCheckoutForm from '../common/components/Donation/InjectedCheckoutForm';
import webAppConfig from '../config';
import { isCordova } from '../utils/cordovaUtils';
import initializejQuery from '../utils/initializejQuery';
import { renderLog } from '../utils/logging';
import DonateStore from '../common/stores/DonateStore';

const stripePromise = loadStripe(webAppConfig.STRIPE_API_KEY);
const VoterFirstRetrieveController = loadable(() => import('../components/Settings/VoterFirstRetrieveController'));

class Membership extends Component {
  constructor (props) {
    super(props);

    this.state = {
      joining: false,
      loaded: false,
      monthlyDonationOtherValue: '',
      monthlyDonationValue: '5.00',
      preDonation: true,
      showWaiting: false,
    };
    this.onOtherAmountFieldChange = this.onOtherAmountFieldChange.bind(this);
    this.onBecomeAMember = this.onBecomeAMember.bind(this);
    this.stopShowWaiting = this.stopShowWaiting.bind(this);
  }

  componentDidMount () {
    initializejQuery(() => {
      // console.log('Membership, componentDidMount after init jQuery');
      // DonateStore.resetState();  I don't think this does anything!
      // 2/25/21 1pm hack TODO DonateActions.donationRefreshDonationList();
      const { showFooter } = this.props;
      showFooter(false);
      this.setState({ loaded: true });
      this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
      // dumpCookies();
    });
  }

  componentWillUnmount () {
    if (this.donateStoreListener) this.donateStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onDonateStoreChange () {
    console.log('onDonateStore DonateStore:', DonateStore.getAll());
    if (DonateStore.donationSuccess()  && DonateStore.donationResponseReceived()) {
      console.log('onDonateStoreChange successful donation detected');
      this.setState({
        preDonation: false,
      });
    }
  }

  static getProps () {
    return {};
  }

  onOtherAmountFieldChange (event) {
    if (event && event.target) {
      this.setState({
        monthlyDonationValue: '',
        monthlyDonationOtherValue: event.target.value.length > 0 ? event.target.value : '',
      });
    }
  }

  onBecomeAMember () {
    // return Promise.then(() => {
    console.log('onBecomeAMember in Membership ------------------------------');
    console.log('Donation store changed in Membership, Checkout form removed');
    this.setState({
      showWaiting: true,
    });
  }

  stopShowWaiting () {
    this.setState({
      showWaiting: false,
    });
  }

  changeValueFromButton (newValue) {
    const { joining } = this.state;
    if (!joining) {
      const { showFooter } = this.props;
      showFooter(true);
    }
    this.setState({
      monthlyDonationValue: newValue,
      monthlyDonationOtherValue: '',
      joining: true,
    });
  }

  openPaymentForm () {
    const { showFooter } = this.props;
    showFooter(true);
    this.setState({
      joining: true,
    });
  }

  render () {
    renderLog('Membership');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { joining, monthlyDonationValue, monthlyDonationOtherValue, loaded, showWaiting, preDonation } = this.state;
    const isMonthly = true;
    if (!loaded) {
      return LoadingWheel;
    }

    return (
      <div>
        <Helmet title="Membership - WeVote.US Campaigns" />
        <PageWrapper cordova={isCordova()}>
          <OuterWrapper>
            <InnerWrapper>
              <IntroductionMessageSection>
                <ContentTitle>
                  { preDonation ? 'Become a WeVote.US member' : 'Thank you for joining We Vote!' }
                </ContentTitle>
                <PageSubStatement show={preDonation}>
                  Voters come to WeVote.US to start and sign campaigns that encourage more people to vote.
                  {' '}
                  Become a member today and fuel our mission to motivate EVERY American to vote.
                </PageSubStatement>
              </IntroductionMessageSection>
              { preDonation && (
                <ContributeGridWrapper>
                  <ContributeMonthlyText>
                    Contribute Monthly:
                  </ContributeMonthlyText>
                  <ContributeGridSection>
                    <ContributeGridItem>
                      <Button
                        classes={(monthlyDonationValue === '3' || monthlyDonationValue === '3.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                        variant="contained"
                        onClick={() => this.changeValueFromButton('3.00')}
                      >
                        $3
                      </Button>
                    </ContributeGridItem>
                    <ContributeGridItem>
                      <Button
                        classes={(monthlyDonationValue === '5' || monthlyDonationValue === '5.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                        variant="contained"
                        onClick={() => this.changeValueFromButton('5.00')}
                      >
                        $5
                      </Button>
                    </ContributeGridItem>
                    <ContributeGridItem>
                      <Button
                        classes={(monthlyDonationValue === '10' || monthlyDonationValue === '10.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                        variant="contained"
                        onClick={() => this.changeValueFromButton('10.00')}
                      >
                        $10
                      </Button>
                    </ContributeGridItem>
                    <ContributeGridItem>
                      <Button
                        classes={(monthlyDonationValue === '20' || monthlyDonationValue === '20.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                        variant="contained"
                        onClick={() => this.changeValueFromButton('20.00')}
                      >
                        $20
                      </Button>
                    </ContributeGridItem>
                    <ContributeGridItemJoin joining={joining}>
                      { !joining ? (
                        <Button
                          classes={{ root: classes.buttonRoot }}
                          color="primary"
                          variant="contained"
                          style={{
                            width: '100%',
                            backgroundColor: 'darkblue',
                            color: 'white',
                          }}
                          onClick={() => this.openPaymentForm()}
                        >
                          Join
                        </Button>
                      ) : (
                        <TextField
                          id="currency-input"
                          label="Other Amount"
                          variant="outlined"
                          value={monthlyDonationOtherValue}
                          onChange={this.onOtherAmountFieldChange}
                          InputLabelProps={{
                            classes: {
                              root: classes.textFieldInputRoot,
                              focused: classes.textFieldInputRoot,
                            },
                            shrink: true,
                          }}
                          InputProps={{
                            classes: {
                              root: classes.textFieldInputRoot,
                              focused: classes.textFieldInputRoot,
                            },
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          style={{ marginTop: 6, textAlign: 'center', width: 100 }}
                        />
                      )}
                    </ContributeGridItemJoin>
                  </ContributeGridSection>
                </ContributeGridWrapper>
              )}
            </InnerWrapper>
          </OuterWrapper>
          <PaymentWrapper show={preDonation}>
            <PaymentCenteredWrapper>
              <Elements stripe={stripePromise}>
                <InjectedCheckoutForm
                  value={monthlyDonationOtherValue || monthlyDonationValue}
                  classes={{}}
                  isMonthly={isMonthly}
                  showWaiting={showWaiting}
                />
              </Elements>
            </PaymentCenteredWrapper>
          </PaymentWrapper>
          <DonationListForm isCampaign leftTabIsMembership />
        </PageWrapper>
        <Suspense fallback={<span>&nbsp;</span>}>
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
Membership.propTypes = {
  classes: PropTypes.object,
  showFooter: PropTypes.func,
};

const styles = () => ({
  buttonRoot: {
    border: '1px solid #2e3c5d',
    fontSize: 18,
    textTransform: 'none',
    width: '100%',
    color: 'black',
    backgroundColor: 'white',
  },
  buttonRootSelected: {
    border: '1px solid #236AC7',
    fontSize: 18,
    fontWeight: 600,
    textTransform: 'none',
    width: '100%',
    color: '#236AC7',
    backgroundColor: 'white',
  },
  textFieldRoot: {
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
    boxShadow: '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0px rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)',
  },
  textFieldInputRoot: {
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
    width: 150,
  },
  stripeAlertError: {
    background: 'rgb(255, 177, 160)',
    color: 'rgb(163, 40, 38)',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    // height: 40,
    fontSize: 14,
    width: '100%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      // height: 35,
      fontSize: 14,
    },
  },
});

const ContentTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
  }
`;

const InnerWrapper = styled.div`
`;

const PaymentWrapper  = styled.div`
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  height: ${(props) => (props.show ? 'inherit' : '0')};
  text-align: center;
`;

const PaymentCenteredWrapper  = styled.div`
  width: 500px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 300px;
  }
  display: inline-block;
  background-color: rgb(246, 244,246);
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0px rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
  border: 2px solid darkgrey;
  border-radius: 3px;
  padding: 8px;
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 0 5px 0;
`;

const IntroductionMessageSection = styled.div`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 1em;
  }
`;

const PageSubStatement = styled.div`
  font-size: 18px;
  text-align: left;
  margin: 0 0 1em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const ContributeGridWrapper = styled.div`
  background-color: #ebebeb;
  padding: 10px;
  border: 1px solid darkgrey;
  margin: auto auto 20px auto;
  width: 500px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 300px;
  }
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
  ${({ joining }) => ((joining) ?
    'padding: 5px 10px;' :
    'padding: 5px 10px;'
  )};
  background-color: #ebebeb;
  font-size: 30px;
  text-align: center;
  grid-column: auto / span 2;
`;

export default withStyles(styles)(Membership);
