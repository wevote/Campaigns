import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

export default function SignInModalLoader (props) {
  console.log('Inside the SignInModalLoader ---------------------');
  const { show, closeFunction } = props;
  if (show === false) {
    return <></>;
  }

  const SignInModal = React.lazy(() => import('./SignInModal'));

  return (
    <Suspense fallback={<span>...</span>}>
      <SignInModal show={show} closeFunction={closeFunction} />
    </Suspense>
  );
}
SignInModalLoader.propTypes = {
  show: PropTypes.bool,
  closeFunction: PropTypes.func.isRequired,
};
