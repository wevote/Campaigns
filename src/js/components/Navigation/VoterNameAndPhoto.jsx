import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AccountCircle } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import { shortenText } from '../../utils/textFormat';
import anonymous from '../../../img/global/icons/avatar-generic.png';
import initializejQuery from '../../utils/initializejQuery';
import LazyImage from '../../utils/LazyImage';


class VoterNameAndPhoto extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    initializejQuery(() => {
      VoterActions.voterRetrieve();
      // console.log('VoterNameAndPhoto, componentDidMount voterRetrieve fired ');
    });
    // this.start = window.performance.now();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log('VoterNameAndPhoto onVoterStoreChange');
    // console.log('VoterNameAndPhoto onVoterStoreChange voter:', VoterStore.getVoter());
    // eslint-disable-next-line react/no-unused-state
    this.setState({ voterLoaded: true });
  }

  render () {
    renderLog('VoterNameAndPhoto');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('VoterNameAndPhoto voterLoaded at start of render: ', voterLoaded);
    const { classes } = this.props;
    const voter = VoterStore.getVoter();
    let voterIsSignedIn = false;
    let voterPhotoUrlMedium;
    if (voter) {
      const { is_signed_in: signedIn, voter_photo_url_medium: photoURL  } = voter;
      voterIsSignedIn  = signedIn;
      voterPhotoUrlMedium = photoURL;
      // console.log('VoterNameAndPhoto at render, voter:', voter);
    }
    // const end = window.performance.now();
    // console.log(`Execution time: ${end - this.start} ms, ${voterPhotoUrlMedium}`);
    const voterFirstName = VoterStore.getFirstName();

    return (
      <Wrapper>
        {voterIsSignedIn && (
          <>
            {voterPhotoUrlMedium ? (
              <LazyImage
                src={voterPhotoUrlMedium}
                placeholder={anonymous}
                className="header-nav__avatar"
                height={34}
                width={34}
                alt="Your Settings"
              />
            ) : (
              <NameAndPhotoWrapper id="nameAndPhotoWrapper">
                <FirstNameWrapper id="firstNameWrapper">
                  {shortenText(voterFirstName, 9)}
                </FirstNameWrapper>
                <AccountCircle classes={{ root: classes.accountCircleRoot }} />
              </NameAndPhotoWrapper>
            )}
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

