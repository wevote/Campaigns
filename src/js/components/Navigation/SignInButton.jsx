import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';
import voterSignOut from '../../utils/voterSignOut';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';


class SignInButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({ voterIsSignedIn });
    // this.start = window.performance.now();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log('SignInButton onVoterStoreChange voter:', VoterStore.getVoter());
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({ voterIsSignedIn });
  }

  openSignInModal = () => {
    // console.log('openSignInModal');
    AppActions.setShowSignInModal(true);
  };

  signOut = () => {
    voterSignOut();
  };

  render () {
    renderLog('SignInButton');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SignInButton voterLoaded at start of render: ', voterLoaded);
    // const end = window.performance.now();
    // console.log(`Execution time: ${end - this.start} ms, ${voterPhotoUrlMedium}`);
    const { hideSignOut, topNavigationStyles } = this.props;
    const { voterIsSignedIn } = this.state;

    return (
      <Wrapper>
        {voterIsSignedIn ? (
          <>
            {!(hideSignOut) && (
              <SignInText onClick={this.signOut} topNavigationStyles={topNavigationStyles}>Sign&nbsp;out</SignInText>
            )}
          </>
        ) : (
          <SignInText onClick={this.openSignInModal} topNavigationStyles={topNavigationStyles}>Sign&nbsp;in</SignInText>
        )}
      </Wrapper>
    );
  }
}
SignInButton.propTypes = {
  hideSignOut: PropTypes.bool,
  topNavigationStyles: PropTypes.bool,
};

const SignInText = styled.div`
  ${({ topNavigationStyles }) => (topNavigationStyles ? 'color: #6f6f6f; font-size: 14px; :hover { color: #4371cc; };' : '')}
`;

const Wrapper = styled.div`
  width: 100%;
`;

export default SignInButton;

