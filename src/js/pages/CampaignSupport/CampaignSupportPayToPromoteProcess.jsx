import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import { Button, InputAdornment, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AppStore from '../../stores/AppStore';
import DonateActions from '../../actions/DonateActions';
import DonationListForm from '../../components/Donation/DonationListForm';
import LoadingWheel from '../../components/LoadingWheel';
import InjectedCheckoutForm from '../../components/Donation/InjectedCheckoutForm';
import webAppConfig from '../../config';
import CampaignStore from '../../stores/CampaignStore';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import DonateStore from '../../stores/DonateStore';
import VoterStore from '../../stores/VoterStore';
import {
  SkipForNowButtonPanel,
  SkipForNowButtonWrapper,
} from '../../components/Style/CampaignSupportStyles';

const stripePromise = loadStripe(webAppConfig.STRIPE_API_KEY);
const VoterFirstRetrieveController = loadable(() => import('../../components/Settings/VoterFirstRetrieveController'));

class CampaignSupportPayToPromoteProcess extends Component {
  constructor (props) {
    super(props);

    this.state = {
      campaignSEOFriendlyPath: '',
      campaignTitle: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
      loaded: false,
      chipInPaymentValue: '3.00',
      chipInPaymentOtherValue: '',
      subscriptionCount: -1,
      showWaiting: false,
      voterFirstName: '',
      waitingForDonationWithStripe: false,
    };
    this.onOtherAmountFieldChange = this.onOtherAmountFieldChange.bind(this);
    this.onChipIn = this.onChipIn.bind(this);
    this.stopShowWaiting = this.stopShowWaiting.bind(this);
  }

  componentDidMount () {
    initializejQuery(() => {
      // console.log('CampaignSupportPayToPromoteProcess, componentDidMount after init jQuery');
      const { setShowHeaderFooter } = this.props;
      setShowHeaderFooter(false);
      this.setState({ loaded: true });
      this.onAppStoreChange();
      this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
      this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
      this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
      // dumpCookies();
      this.onVoterStoreChange();
      this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
      const { match: { params } } = this.props;
      const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
      // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
      const {
        campaignSEOFriendlyPath,
        campaignTitle,
        campaignXWeVoteId,
      } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
      this.setState({
        campaignTitle,
      });
      if (campaignSEOFriendlyPath) {
        this.setState({
          campaignSEOFriendlyPath,
        });
      } else if (campaignSEOFriendlyPathFromParams) {
        this.setState({
          campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
        });
      }
      if (campaignXWeVoteId) {
        this.setState({
          campaignXWeVoteId,
        });
      } else if (campaignXWeVoteIdFromParams) {
        this.setState({
          campaignXWeVoteId: campaignXWeVoteIdFromParams,
        });
      }
      // Take the "calculated" identifiers and retrieve if missing
      retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    });
  }

  componentWillUnmount () {
    this.props.setShowHeaderFooter(true);
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
    this.donateStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onAppStoreChange () {
    const chosenWebsiteName = AppStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStoreChange () {
    const { match: { params } } = this.props;
    const { campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams, campaignXWeVoteId: campaignXWeVoteIdFromParams } = params;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    const {
      campaignSEOFriendlyPath,
      campaignTitle,
      campaignXWeVoteId,
    } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
    this.setState({
      campaignTitle,
    });
    if (campaignSEOFriendlyPath) {
      this.setState({
        campaignSEOFriendlyPath,
      });
    } else if (campaignSEOFriendlyPathFromParams) {
      this.setState({
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
      });
    }
    if (campaignXWeVoteId) {
      this.setState({
        campaignXWeVoteId,
      });
    } else if (campaignXWeVoteIdFromParams) {
      this.setState({
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      });
    }
  }

  onDonateStoreChange () {
    // console.log('onDonateStore DonateStore:', DonateStore.getAll());
    if (DonateStore.donationSuccess()) {
      if (this.state.waitingForDonationWithStripe) {
        this.pollForWebhookCompletion(60);
        this.setState({
          waitingForDonationWithStripe: false,
        });
      }
    } else if (this.state.waitingForDonationWithStripe) {
      console.log('onDonateStoreChange donation unsuccessful at this point');
    } else {
      console.log('onDonateStoreChange unsuccessful donation');
      this.setState({ showWaiting: false });
    }
    this.forceUpdate();
  }

  static getProps () {
    return {};
  }

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getVoterFirstName();
    this.setState({
      voterFirstName,
    });
  }

  onOtherAmountFieldChange (event) {
    if (event && event.target) {
      this.setState({
        chipInPaymentValue: '',
        chipInPaymentOtherValue: event.target.value.length > 0 ? event.target.value : '',
      });
    }
  }

  onChipIn () {
    // return Promise.then(() => {
    console.log('onChipIn in CampaignSupportPayToPromoteProcess ------------------------------');
    console.log('Donation store changed in CampaignSupportPayToPromoteProcess, Checkout form removed');
    this.setState({
      waitingForDonationWithStripe: true,
      showWaiting: true,
      subscriptionCount: DonateStore.getVoterSubscriptionHistory().length,
    });
  }

  goToIWillShare = () => {
    const pathForNextStep = `${this.getCampaignBasePath()}/share-campaign`;
    historyPush(pathForNextStep);
  }

  getCampaignBasePath = () => {
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.state;
    let campaignBasePath = '';
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }
    return campaignBasePath;
  }

  pollForWebhookCompletion (pollCount) {
    // console.log(`pollForWebhookCompletion polling -- start: ${this.state.donationPaymentHistory ? this.state.donationPaymentHistory.length : -1}`);
    // console.log(`pollForWebhookCompletion polling -- start pollCount: ${pollCount}`);
    this.timer = setTimeout(() => {
      const latestCount = DonateStore.getVoterSubscriptionHistory().length;
      if (pollCount === 0 || (this.state.subscriptionCount < latestCount)) {
        console.log(`pollForWebhookCompletion polling -- clearTimeout: ${latestCount}`);
        console.log(`pollForWebhookCompletion polling -- pollCount: ${pollCount}`);
        clearTimeout(this.timer);
        this.setState({ subscriptionCount: -1 });
        return;
      }
      console.log(`pollForWebhookCompletion polling ----- ${pollCount}`);
      DonateActions.donationRefreshDonationList();
      this.pollForWebhookCompletion(pollCount - 1);  // recursive
    }, 500);
  }

  changeValueFromButton (newValue) {
    this.setState({
      chipInPaymentValue: newValue,
      chipInPaymentOtherValue: '',
    });
  }

  stopShowWaiting () {
    this.setState({
      showWaiting: false,
    });
  }

  render () {
    renderLog('CampaignSupportPayToPromoteProcess');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      campaignTitle, chipInPaymentValue, chipInPaymentOtherValue, chosenWebsiteName,
      loaded, showWaiting, voterFirstName,
    } = this.state;
    const htmlTitle = `Payment to support ${campaignTitle} - ${chosenWebsiteName}`;
    if (!loaded) {
      return LoadingWheel;
    }

    return (
      <div>
        <Helmet title={htmlTitle} />
        <PageWrapper cordova={isCordova()}>
          <OuterWrapper>
            <InnerWrapper>
              <IntroductionMessageSection>
                <ContentTitle>
                  Thank you for helping this campaign reach more voters
                  {voterFirstName ? `, ${voterFirstName}` : ''}
                  !
                </ContentTitle>
              </IntroductionMessageSection>
              <ContributeGridWrapper>
                <ContributeMonthlyText>
                  Please chip in what you can with a one-time contribution:
                </ContributeMonthlyText>
                <ContributeGridSection>
                  <ContributeGridItem>
                    <Button
                      classes={(chipInPaymentValue === '3' || chipInPaymentValue === '3.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValueFromButton('3.00')}
                    >
                      <ButtonInsideWrapper>
                        <WhatYouGet>
                          <span className="u-show-mobile">25 views</span>
                          <span className="u-show-desktop-tablet">25 views of campaign</span>
                        </WhatYouGet>
                        <PaymentAmount>
                          $3
                        </PaymentAmount>
                      </ButtonInsideWrapper>
                    </Button>
                  </ContributeGridItem>
                  <ContributeGridItem>
                    <Button
                      classes={(chipInPaymentValue === '15' || chipInPaymentValue === '15.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValueFromButton('15.00')}
                    >
                      <ButtonInsideWrapper>
                        <WhatYouGet>
                          <span className="u-show-mobile">200 views</span>
                          <span className="u-show-desktop-tablet">200 views of campaign</span>
                        </WhatYouGet>
                        <PaymentAmount>
                          $15
                        </PaymentAmount>
                      </ButtonInsideWrapper>
                    </Button>
                  </ContributeGridItem>
                  <ContributeGridItem>
                    <Button
                      classes={(chipInPaymentValue === '35' || chipInPaymentValue === '35.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValueFromButton('35.00')}
                    >
                      <ButtonInsideWrapper>
                        <WhatYouGet>
                          <span className="u-show-mobile">750 views</span>
                          <span className="u-show-desktop-tablet">750 views of campaign</span>
                        </WhatYouGet>
                        <PaymentAmount>
                          $35
                        </PaymentAmount>
                      </ButtonInsideWrapper>
                    </Button>
                  </ContributeGridItem>
                  <ContributeGridItem>
                    <Button
                      classes={(chipInPaymentValue === '50' || chipInPaymentValue === '50.00') ? { root: classes.buttonRootSelected } : { root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValueFromButton('50.00')}
                    >
                      <ButtonInsideWrapper>
                        <WhatYouGet>
                          <span className="u-show-mobile">1,250 views</span>
                          <span className="u-show-desktop-tablet">1,250 views of campaign</span>
                        </WhatYouGet>
                        <PaymentAmount>
                          $50
                        </PaymentAmount>
                      </ButtonInsideWrapper>
                    </Button>
                  </ContributeGridItem>
                  <ContributeGridItemOtherItem>
                    <TextField
                      id="currency-input"
                      label="Other Amount"
                      variant="outlined"
                      value={chipInPaymentOtherValue}
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
                      style={{ marginTop: 6, textAlign: 'center', width: '100%' }}
                    />
                  </ContributeGridItemOtherItem>
                </ContributeGridSection>
              </ContributeGridWrapper>
            </InnerWrapper>
          </OuterWrapper>
          <PaymentWrapper>
            <PaymentCenteredWrapper>
              <Elements stripe={stripePromise}>
                <InjectedCheckoutForm
                  value={chipInPaymentOtherValue || chipInPaymentValue}
                  classes={{}}
                  stopShowWaiting={this.stopShowWaiting}
                  onBecomeAMember={this.onChipIn}
                  showWaiting={showWaiting}
                />
              </Elements>
            </PaymentCenteredWrapper>
          </PaymentWrapper>
          <DonationListForm waitForWebhook />
          <SkipForNowButtonWrapper>
            <SkipForNowButtonPanel>
              <Button
                classes={{ root: classes.buttonSimpleLink }}
                color="primary"
                id="skipPayToPromote"
                onClick={this.goToIWillShare}
              >
                Sorry, I can&apos;t chip in right now
              </Button>
            </SkipForNowButtonPanel>
          </SkipForNowButtonWrapper>
        </PageWrapper>
        <Suspense fallback={<span>&nbsp;</span>}>
          <VoterFirstRetrieveController />
        </Suspense>
      </div>
    );
  }
}
CampaignSupportPayToPromoteProcess.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
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
    border: '1px solid red',
    fontSize: 18,
    fontWeight: 600,
    textTransform: 'none',
    width: '100%',
    color: 'red',
    backgroundColor: 'white',
  },
  buttonSimpleLink: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textDecoration: 'underline',
    textTransform: 'none',
    minWidth: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
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
    width: '100%',
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

const ButtonInsideWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ContentTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
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
`;

const ContributeGridSection = styled.div`
  background-color: #ebebeb;
  display: flex;
  flex-direction: column;
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

const ContributeGridItemOtherItem = styled.div`
  background-color: #ebebeb;
  padding: 5px 10px;
  font-size: 30px;
  text-align: center;
  grid-column: auto / span 2;
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

const InnerWrapper = styled.div`
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 0 5px 0;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const PaymentAmount = styled.div`
  font-size: 1.1rem;
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

const PaymentWrapper  = styled.div`
  text-align: center;
`;

const WhatYouGet = styled.div`
  font-size: 1.3rem;
`;

export default withStyles(styles)(CampaignSupportPayToPromoteProcess);
