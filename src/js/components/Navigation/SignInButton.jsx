import React, { Component } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import { shortenText } from '../../utils/textFormat';
import SignInModal from '../Widgets/SignInModal';
import anonymous from '../../../img/global/icons/avatar-generic.png';
import initializejQuery from '../../utils/initializejQuery';
import LazyImage from '../../utils/LazyImage';


class SignInButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showSignInModal: false,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    initializejQuery(() => {
      VoterActions.voterRetrieve();
      // console.log('SignInButton, componentDidMount voterRetrieve fired ');
    });
    // this.start = window.performance.now();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log('SignInButton onVoterStoreChange');
    // console.log('SignInButton onVoterStoreChange voter:', VoterStore.getVoter());
    // eslint-disable-next-line react/no-unused-state
    this.setState({ voterLoaded: true });
  }

  // openSignInModal = () => {
  //   // AppActions.setShowSignInModal(false);
  //   // console.log('openSignInModal');
  //   this.setState({ showSignInModal: true });
  // };

  closeSignInModal = () => {
    // AppActions.setShowSignInModal(false);
    // console.log('closeSignInModal voter:', VoterStore.getVoter());
    this.setState({ showSignInModal: false });
  };

  toggleSignInModal = () => {
    const { showSignInModal } = this.state;
    // console.log('toggleLoadedState showSignInModal:', showSignInModal);
    this.setState({ showSignInModal: !showSignInModal });
  }

  render () {
    renderLog('SignInButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { showSignInModal } = this.state;
    // console.log('SignInButton voterLoaded at start of render: ', voterLoaded);
    const { classes } = this.props;
    const voter = VoterStore.getVoter();
    let voterIsSignedIn = false;
    let voterPhotoUrlMedium;
    if (voter) {
      const { is_signed_in: signedIn, voter_photo_url_medium: photoURL  } = voter;
      voterIsSignedIn  = signedIn;
      voterPhotoUrlMedium = photoURL;
      // console.log('SignInButton at render, voter:', voter);
    }
    // const end = window.performance.now();
    // console.log(`Execution time: ${end - this.start} ms, ${voterPhotoUrlMedium}`);
    const voterFirstName = VoterStore.getFirstName();

    return (
      <div>
        {voterIsSignedIn ? (
          <>
            {voterPhotoUrlMedium ? (
              <IconButton
                classes={{ root: classes.iconButtonRoot }}
                id="profileAvatarHeaderBar"
                onClick={this.toggleSignInModal}
                style={{ padding: '8px 8px 0 0' }}
              >
                <LazyImage
                  src={voterPhotoUrlMedium}
                  placeholder={anonymous}
                  className="header-nav__avatar"
                  height={34}
                  width={34}
                  alt="Your Settings"
                />
              </IconButton>
            ) : (
              <IconButton
                classes={{ root: classes.iconButtonRoot }}
                id="profileAvatarHeaderBar"
                onClick={this.toggleSignInModal}
              >
                <FirstNameWrapper>
                  {shortenText(voterFirstName, 9)}
                </FirstNameWrapper>
                <AccountCircle />
              </IconButton>
            )}
          </>
        ) : (
          <Button
            className="header-sign-in"
            classes={{ root: classes.headerButtonRoot }}
            color="primary"
            id="signInHeaderBar"
            onClick={this.toggleSignInModal}
            variant="text"
          >
            <SignInText>Sign In</SignInText>
          </Button>
        )}
        {showSignInModal ? <SignInModal show={showSignInModal} closeFunction={this.closeSignInModal} /> : null}
      </div>
    );
  }
}
SignInButton.propTypes = {
  classes: PropTypes.object,
};

// const SignIn = styled.span`
//   font-size: 14px;
//   color: blue;
// `;

const FirstNameWrapper = styled.div`
  font-size: 14px;
  padding-right: 4px;
`;

const SignInText = styled.div`
  font-size: 14px;
  padding: 8px 8px 0;
  color: blue;
  text-transform: none;
`;


export default SignInButton;

