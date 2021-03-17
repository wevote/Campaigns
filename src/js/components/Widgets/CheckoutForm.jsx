import React from 'react';
import { TextField } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { CardElement } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import whiteLock from '../../../img/global/svg-icons/white-lock.svg';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import moneyStringToPennies from '../../utils/moneyStringToPennies';
import SplitIconButton from './SplitIconButton';


const iconButtonStyles = {
  width: window.innerWidth < 1280 ? 220 : 300,
  margin: '16px',
};

class CheckoutForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      donationWithStripeSubmitted: false,
      paymentError: false,
      stripeErrorMessageForVoter: '',
      emailFieldError: false,
      emailFieldText: '',
      emailValidationErrorText: '',
    };
    this.emailChange = this.emailChange.bind(this);
  }

  componentDidMount () {
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
    DonateActions.donationRefreshDonationList();
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
    if (this.stripeErrorTimer) {
      clearTimeout(this.stripeErrorTimer);
      this.stripeErrorTimer = null;
    }
    if (this.stripeSubmitTimer) {
      clearTimeout(this.stripeSubmitTimer);
      this.stripeSubmitTimer = null;
    }
  }

  onDonateStoreChange = () => {
    const { donationWithStripeSubmitted } = this.state;
    console.log('onDonateStoreChange');
    try {
      let stripeErrorMessageForVoter = DonateStore.donationError();
      const getAmountPaidViaStripe = DonateStore.getAmountPaidViaStripe();
      if (getAmountPaidViaStripe === 0  && donationWithStripeSubmitted) {
        stripeErrorMessageForVoter = 'The payment did not go through, please try again later.';
      }
      if (stripeErrorMessageForVoter) {
        this.setState({
          paymentError: true,
          stripeErrorMessageForVoter,
        });
        this.stripeErrorTimer = setTimeout(() => {
          this.setState({
            paymentError: false,
            stripeErrorMessageForVoter: '',
          });
        }, 5000);
      }
      console.log('getAmountPaidViaStripe:', getAmountPaidViaStripe);
      if (getAmountPaidViaStripe) {
        // Tell the parent component to move past this step
        // this.paymentProcessedFunction();
        this.setState({
          donationWithStripeSubmitted: false,
        });
      }
    } catch (err) {
      console.log('onDonateStoreChange caught error: ', err);
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { stripe, elements } = this.props;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    console.log(`handleSubmit error: ${error}  paymentMethod: ${paymentMethod}`);
  };

  submitStripePayment = async (emailFromVoter) => {
    const { stripe, value, elements, onBecomeAMember } = this.props;
    const { emailFieldError, emailFieldText } = this.state;

    // if (emailFromVoter === '') {
    //   // This is a rare case, save the email that the voter entered since his record does not have a primary email address
    //   // The risk here, is that they mistyped their email and would then have to go to the settings page to correct it.
    //   // The email is a unique key field in the Postgres Donation tables
    //   VoterActions.voterEmailAddressSave(emailFieldText, false);
    // }

    if (emailFieldError) {
      this.setState({
        emailValidationErrorText: 'Our payment processor requires an email address for this transaction.',
        emailFieldError: false,
      });
    } else {
      const email = (emailFromVoter && emailFromVoter.length > 0) ? emailFromVoter : emailFieldText;

      const { token } = await stripe.createToken(elements.getElement(CardElement));
      console.log(`stripe token object from component/dialog: ${token}`);
      if (token) {
        const donateMonthly = true;
        const isOrganizationPlan = false;

        const donationPennies = moneyStringToPennies(value);

        DonateActions.donationWithStripe(token.id, token.client_ip, email, donationPennies, donateMonthly, isOrganizationPlan, '', '');
        onBecomeAMember();
        this.setState({
          donationWithStripeSubmitted: true,
        });
      } else {
        this.setState({
          paymentError: true,
        });
        this.stripeSubmitTimer = setTimeout(() => {
          this.setState({ paymentError: false });
        }, 3000);
      }
    }
  }

  emailChange = (event) => {
    const currentEntry = event.target.value;
    const validEmailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const valid = currentEntry.match(validEmailPattern) != null;
    console.log('valid? : ', currentEntry, ' valid: ', valid);
    this.setState({
      emailFieldError: !valid,
      emailFieldText: currentEntry,
      emailValidationErrorText: 'Our payment processor requires a valid email address',
    });
  }

  render () {
    renderLog('CheckoutForm');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { donationWithStripeSubmitted, emailValidationErrorText, emailFieldError, paymentError, stripeErrorMessageForVoter } = this.state;
    const voter = VoterStore.getVoter();
    const emailFromVoter = (voter && voter.email) || '';
    console.log('render emailFieldError:', emailFieldError);
    const paymentErrorText = (stripeErrorMessageForVoter) || 'Please verify your information.';
    const error = emailFieldError || paymentError;
    const errorText = emailFieldError ? emailValidationErrorText : paymentErrorText;

    return (
      <>
        {error ? (
          <div className={classes.stripeAlertError}>{errorText}</div>
        ) : (
          <div style={{ height: 41 }} />
        )}
        {emailFromVoter.length === 0 ? (
          <TextFieldContainer>
            <TextField
              id="outlined-basic-email"
              label="email"
              variant="outlined"
              className={classes.root}
              error={emailFieldError}
              onChange={this.emailChange}
              autoFocus
            />
          </TextFieldContainer>
        ) : null}
        <form onSubmit={this.handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  margin: 4,
                  fontSize: '18px',
                  color: 'darkgrey',
                  '::placeholder': {
                    color: 'lightgrey',
                  },
                },
                empty: {
                  backgroundColor: 'white',
                  margin: 10,
                },
                invalid: {
                  color: '#9e2146',
                  fontSize: '18px',
                },
              },
            }}
          />
          <SplitIconButton
            buttonText="Become a member"
            backgroundColor="rgb(33, 95, 254)"
            separatorColor="rgb(33, 95, 254)"
            styles={iconButtonStyles}
            adjustedIconWidth={30}
            disabled={donationWithStripeSubmitted}
            externalUniqueId="facebookSignIn"
            icon={<ReactSVG src={whiteLock} />}
            id="stripeCheckOutForm"
            onClick={() => this.submitStripePayment(emailFromVoter)}
            // onKeyDown={this.onKeyDown}
          />
          <StripeTagLine>
            Secure processing provided by Stripe
          </StripeTagLine>
        </form>
      </>
    );
  }
}

CheckoutForm.propTypes = {
  stripe: PropTypes.object,
  elements: PropTypes.object,
  value: PropTypes.string,
  classes: PropTypes.object,
  onBecomeAMember: PropTypes.func,
};

const StripeTagLine = styled.div`
  color: grey;
  font-size: 12px;
  padding-top: 5px;
`;

const TextFieldContainer = styled.div`
  color: grey;
  //background-color: aqua;
  font-size: 12px;
  padding: 5px 0 10px 0;
`;

const styles = () => ({
  root: {
    '& .MuiOutlinedInput-input': {
      backgroundColor: 'white',
    },
  },
  stripeAlertError: {
    background: 'rgb(255, 177, 160)',
    color: 'rgb(163, 40, 38)',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
    width: '94%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      fontSize: 14,
    },
  },
});

export default withTheme(withStyles(styles)(CheckoutForm));
