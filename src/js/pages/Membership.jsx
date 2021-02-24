import React, { Component } from 'react';
import { Button, InputAdornment, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import MainFooter from '../components/Navigation/MainFooter';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';
import CheckoutForm from '../components/Widgets/CheckoutForm';
import { isCordova } from '../utils/cordovaUtils';
import { renderLog } from '../utils/logging';


const InjectedCheckoutForm = (value) => (
  <ElementsConsumer>
    {({ stripe, elements }) => (
      <CheckoutForm stripe={stripe} elements={elements} value={value} />
    )}
  </ElementsConsumer>
);

class Membership extends Component {
  constructor (props) {
    super(props);

    // const library = 'stripe';
    this.state = {
      stripePromise: loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh'),
      value: 0,
      joining: false,
    };
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  static getProps () {
    return {};
  }

  onFieldChange (event) {
    if (event && event.target) {
      this.setState({
        value: event.target.value,
      });
    }
  }

  changeValue (newValue) {
    this.setState({
      value: newValue,
      joining: true,
    });
  }

  render () {
    const { classes } = this.props;
    const { value, joining, stripePromise } = this.state;
    renderLog('Membership');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`Membership window.location.href: ${window.location.href}`);
    }

    return (
      <div>
        <Helmet title="Membership - We Vote Campaigns" />
        <MainHeaderBar />
        <PageWrapper cordova={isCordova()}>
          <OuterWrapper>
            <InnerWrapper>
              <IntroductionMessageSection>
                <ContentTitle>Become a WeVote.US member</ContentTitle>
                <PageSubStatement joining={joining}>
                  Voters come to WeVote.US to start and sign campaigns that encourage more people to vote.
                  Leading up to election day, review your ballot on ballot.WeVote.US, and discuss what is on your
                  ballot with your friends.
                  Become a member today and fuel our mission to help every American to vote.
                </PageSubStatement>
              </IntroductionMessageSection>
              <ContributeGridWrapper>
                <ContributeMonthlyText>
                  Contribute Monthly:
                </ContributeMonthlyText>
                <ContributeGridSection>
                  <ContributeGridItem>
                    <Button
                      classes={{ root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValue('3.00')}
                    >
                      $3
                    </Button>
                  </ContributeGridItem>
                  <ContributeGridItem>
                    <Button
                      classes={{ root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValue('5.00')}
                    >
                      $5
                    </Button>
                  </ContributeGridItem>
                  <ContributeGridItem>
                    <Button
                      classes={{ root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValue('10.00')}
                    >
                      $10
                    </Button>
                  </ContributeGridItem>
                  <ContributeGridItem>
                    <Button
                      classes={{ root: classes.buttonRoot }}
                      variant="contained"
                      onClick={() => this.changeValue('20.00')}
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
                        onClick={() => this.changeValue('5.00')}
                      >
                        Join
                      </Button>
                    ) : (
                      <TextField
                        id="currency-input"
                        label="Amount"
                        variant="outlined"
                        value={value}
                        onChange={this.onFieldChange}
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
            </InnerWrapper>
          </OuterWrapper>
          <PaymentWrapper joining={joining}>
            <PaymentCenteredWrapper>
              <Elements stripe={stripePromise}>
                <InjectedCheckoutForm value={value} />
              </Elements>
            </PaymentCenteredWrapper>
          </PaymentWrapper>
        </PageWrapper>
        <MainFooter displayFooter={!joining} />
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
  display: ${({ joining }) => ((joining) ? '' : 'none')};
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
  display: ${({ joining }) => ((joining) ? 'none' : 'unset')};
  font-size: 18px;
  text-align: left;
  margin: 0 0 1em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
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
