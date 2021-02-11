import React, { Component } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import { isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { shortenText } from '../../utils/textFormat';
import SignInModal from '../Widgets/SignInModal';


class SignInButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showSignInModal: false,
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    import('jquery').then(({ default: jquery }) => {
      window.jQuery = jquery;
      window.$ = jquery;
      VoterActions.voterRetrieve();
      console.log('SignInButton, componentDidMount voterRetrieve fired ');
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    console.log('SignInButton onVoterStoreChange');
    this.setState({ voterLoaded: true });
  }

  openSignInModal = () => {
    // AppActions.setShowSignInModal(false);
    console.log('openSignInModal -----------------------------');
    this.setState({ showSignInModal: true });
  };

  closeSignInModal = () => {
    // AppActions.setShowSignInModal(false);
    console.log('closeSignInModal -----------------------------');
    this.setState({ showSignInModal: false });
  };

  // signInModalLoader = () => {
  //   console.log('signInModalLoader -----------------------------');
  //   const { showSignInModal } = this.state;
  //   return <SignInModal show={showSignInModal} closeFunction={this.closeSignInModal} />;
  // }

  toggleSignInModal = () => {
    const { showSignInModal } = this.state;
    console.log('toggleLoadedState -----------------------------', showSignInModal);
    this.setState({ showSignInModal: !showSignInModal });
  }

  render () {
    renderLog('SignInButton');  // Set LOG_RENDER_EVENTS to log all renders
    // const { showSignInModal } = this.state;
    const { classes } = this.props;
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter && voter.is_signed_in;
    const voterPhotoUrlMedium = voter && voter.voter_photo_url_medium;
    const voterFirstName = VoterStore.getFirstName();

    return (
      <div>
        {voterIsSignedIn ? (
          <span>
            {voterPhotoUrlMedium ? (
              <span>
                <div
                  id="profileAvatarHeaderBar"
                  className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                  onClick={this.toggleProfilePopUp}
                >
                  <img
                    className="header-nav__avatar"
                    src={voterPhotoUrlMedium}
                    height={34}
                    width={34}
                    alt="Your Settings"
                  />
                </div>
              </span>
            ) : (
              <span>
                <IconButton
                  classes={{ root: classes.iconButtonRoot }}
                  id="profileAvatarHeaderBar"
                  onClick={this.toggleProfilePopUp}
                >
                  <FirstNameWrapper>
                    {shortenText(voterFirstName, 9)}
                  </FirstNameWrapper>
                  <AccountCircle />
                </IconButton>
              </span>
            )}
          </span>
        ) : (
          <Button
            className="header-sign-in"
            classes={{ root: classes.headerButtonRoot }}
            color="primary"
            id="signInHeaderBar"
            onClick={this.toggleSignInModal}
            variant="text"
          >
            <span className="u-no-break">Sign In</span>
          </Button>
        )}
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


export default SignInButton;

