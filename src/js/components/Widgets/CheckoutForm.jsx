import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import whiteLock from '../../../img/global/svg-icons/white-lock.svg';
import SplitIconButton from './SplitIconButton';
import DonateStore from '../../stores/DonateStore';
// import DonateActions from '../../actions/DonateActions';


const iconButtonStyles = {
  width: window.innerWidth < 1280 ? 220 : 300,
  margin: '16px',
};

class CheckoutForm extends React.Component {
  componentDidMount () {
    DonateStore.resetState();
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { stripe, elements } = this.props;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
  };

  render () {
    return (
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
          backgroundColor="rgba(236, 42, 32, .9)"
          separatorColor="rgba(236, 42, 32, .9)"
          styles={iconButtonStyles}
          adjustedIconWidth={30}
          // disabled={someBlockingBoolean}
          externalUniqueId="facebookSignIn"
          icon={<ReactSVG src={whiteLock} />}
          id="facebookSignIn"
          // onClick={this.didClickButton}
          // onKeyDown={this.onKeyDown}
        />
        <StripeTagLine>
          Secure processing provided by Stripe
        </StripeTagLine>
      </form>
    );
  }
}

CheckoutForm.propTypes = {
  stripe: PropTypes.object,
  elements: PropTypes.object,
};

const StripeTagLine = styled.div`
  color: grey;
  font-size: 12px;
  padding-top: 5px;
`;

export default CheckoutForm;
