import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AccountCircle } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import anonymous from '../../../img/global/icons/avatar-generic.png';
import LazyImage from '../../utils/LazyImage';
import { renderLog } from '../../utils/logging';
import { shortenText } from '../../utils/textFormat';
import VoterStore from '../../stores/VoterStore';


class VoterNameAndPhoto extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log('VoterNameAndPhoto onVoterStoreChange voter:', VoterStore.getVoter());
    const voter = VoterStore.getVoter();
    let voterIsSignedIn = false;
    let voterPhotoUrlMedium;
    if (voter) {
      const { is_signed_in: signedIn, voter_photo_url_medium: photoURL  } = voter;
      voterIsSignedIn  = signedIn;
      voterPhotoUrlMedium = photoURL;
    }
    const voterFirstName = VoterStore.getFirstName();
    this.setState({
      voterFirstName,
      voterIsSignedIn,
      voterPhotoUrlMedium,
    });
  }

  render () {
    renderLog('VoterNameAndPhoto');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('VoterNameAndPhoto voterIsSignedIn at start of render: ', voterIsSignedIn);
    const { classes } = this.props;
    const { voterFirstName, voterIsSignedIn, voterPhotoUrlMedium } = this.state;

    return (
      <Wrapper>
        {voterIsSignedIn && (
          <>
            <NameAndPhotoWrapper id="nameAndPhotoWrapper">
              <FirstNameWrapper id="firstNameWrapper">
                {shortenText(voterFirstName, 9)}
              </FirstNameWrapper>
              {voterPhotoUrlMedium ? (
                <LazyImage
                  src={voterPhotoUrlMedium}
                  placeholder={anonymous}
                  className="profile-photo"
                  height={24}
                  width={24}
                  alt="Your Settings"
                />
              ) : (
                <AccountCircle classes={{ root: classes.accountCircleRoot }} />
              )}
            </NameAndPhotoWrapper>
          </>
        )}
      </Wrapper>
    );
  }
}
VoterNameAndPhoto.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  accountCircleRoot: {
    color: '#999',
  },
});

const FirstNameWrapper = styled.div`
  color: #999;
  font-size: 14px;
  padding-right: 4px;
`;

const NameAndPhotoWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const Wrapper = styled.div`
  margin-right: 2px;
`;

export default withStyles(styles)(VoterNameAndPhoto);
