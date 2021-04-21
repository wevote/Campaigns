import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { FacebookShareButton } from 'react-share';
import { isAndroid, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { androidFacebookClickHandler } from '../Share/shareButtonCommon';

class ShareOnFacebookButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
  }

  saveActionShareButtonFacebook = () => {
    //
  }

  render () {
    renderLog('ShareOnFacebookButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`ShareOnFacebookButton window.location.href: ${window.location.href}`);
    }
    const { mobileMode } = this.props;
    const titleText = 'Support this Campaign';
    let linkToBeShared = 'https://campaigns.wevote.us/';
    let linkToBeSharedUrlEncoded = '';
    linkToBeShared = linkToBeShared.replace('https://file:/', 'https://wevote.us/');  // Cordova
    linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    return (
      <Wrapper>
        <div id="androidFacebook"
             onClick={() => isAndroid() &&
               androidFacebookClickHandler(`${linkToBeSharedUrlEncoded}&t=WeVote`)}
        >
          <FacebookShareButton
            // className="no-decoration"
            id="shareModalFacebookButton"
            onClick={this.saveActionShareButtonFacebook}
            quote={titleText}
            url={`${linkToBeSharedUrlEncoded}`}
            windowWidth={mobileMode ? 350 : 750}
            windowHeight={mobileMode ? 600 : 600}
            disabled={isAndroid()}
            disabledStyle={isAndroid() ? { opacity: 1 } : {}}
          >
            <div className="material_ui_dark_button">
              <div>
                Share on Facebook
              </div>
            </div>
          </FacebookShareButton>
        </div>
      </Wrapper>
    );
  }
}
ShareOnFacebookButton.propTypes = {
  mobileMode: PropTypes.bool,
};

const styles = () => ({
});

const Wrapper = styled.div`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(ShareOnFacebookButton);
