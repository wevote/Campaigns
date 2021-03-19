import React from 'react';
import { ElementsConsumer } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const InjectedCheckoutForm = (params) => {
  const {
    value,
    classes,
    onBecomeAMember,
    showWaiting,
    stopShowWaiting,
  } = params;
  console.log('InjectedCheckoutForm --------- showWaiting', showWaiting);
  if (value && classes) {
    return (
      <ElementsConsumer>
        {({
          stripe,
          elements,
        }) => (
          // <CheckoutFormExample stripe={stripe} elements={elements} />
          <CheckoutForm
            stripe={stripe}
            elements={elements}
            value={value}
            classes={classes}
            onBecomeAMember={onBecomeAMember}
            showWaiting={showWaiting}
            stopShowWaiting={stopShowWaiting}
          />
        )}
      </ElementsConsumer>
    );
  } else {
    return null;
  }
};

export default InjectedCheckoutForm;
