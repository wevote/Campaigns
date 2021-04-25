import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { FacebookMessengerShareButton } from 'react-share';
import AppStore from '../../stores/AppStore';
import CampaignStore from '../../stores/CampaignStore';
import { isAndroid, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { androidFacebookClickHandler, generateQuoteForSharing } from './shareButtonCommon';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import webAppConfig from '../../config';

class SendFacebookDirectMessageButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignX: {},
      inPrivateLabelMode: false,
      numberOfPoliticians: 0,
      politicianListSentenceString: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignCardForList componentDidMount');
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignEndorsementInputField componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onAppStoreChange () {
    const inPrivateLabelMode = AppStore.inPrivateLabelMode();
    this.setState({
      inPrivateLabelMode,
    });
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    let numberOfPoliticians = 0;
    if (campaignXPoliticianList && campaignXPoliticianList.length > 0) {
      numberOfPoliticians = campaignXPoliticianList.length;
    }
    let politicianListSentenceString = '';
    if (numberOfPoliticians > 0) {
      politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    }
    this.setState({
      campaignX,
      numberOfPoliticians,
      politicianListSentenceString,
    });
  }

  generateFullCampaignLink = () => {
    const { hostname } = window.location;
    const domainAddress = `https://${hostname}`;
    const { campaignX } = this.state;
    // console.log('domainAddress:', domainAddress);
    if (!campaignX) {
      return domainAddress;
    }
    const {
      seo_friendly_path: SEOFriendlyPath,
      campaignx_we_vote_id: campaignXWeVoteId,
    } = campaignX;
    if (SEOFriendlyPath) {
      return `${domainAddress}/c/${SEOFriendlyPath}`;
    } else {
      return `${domainAddress}/id/${campaignXWeVoteId}`;
    }
  }

  saveActionShareButton = () => {
    //
  }

  render () {
    renderLog('SendFacebookDirectMessageButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SendFacebookDirectMessageButton window.location.href: ${window.location.href}`);
    }
    if (!webAppConfig.FACEBOOK_APP_ID) {
      return null;
    }
    const { mobileMode } = this.props;
    const { campaignX, inPrivateLabelMode, numberOfPoliticians, politicianListSentenceString } = this.state;
    const {
      campaign_title: campaignTitle,
    } = campaignX;
    let linkToBeShared = this.generateFullCampaignLink();
    let linkToBeSharedUrlEncoded = '';
    linkToBeShared = linkToBeShared.replace('https://file:/', 'https://wevote.us/');  // Cordova
    linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    const quoteForSharing = generateQuoteForSharing(campaignTitle, numberOfPoliticians, politicianListSentenceString);
    const quoteForSharingEncoded = encodeURI(quoteForSharing);
    return (
      <Wrapper>
        <div id="androidFacebook"
             onClick={() => isAndroid() &&
               androidFacebookClickHandler(`${linkToBeSharedUrlEncoded}&t=WeVote`, quoteForSharingEncoded)}
        >
          <FacebookMessengerShareButton
            appId={webAppConfig.FACEBOOK_APP_ID}
            className={mobileMode ? 'material_ui_button_mobile' : ''}
            id="shareOnFacebookButton"
            onClick={this.saveActionShareButton}
            url={`${linkToBeSharedUrlEncoded}`}
            windowWidth={mobileMode ? 350 : 1000}
            windowHeight={mobileMode ? 600 : 600}
            disabled={isAndroid()}
            disabledStyle={isAndroid() ? { opacity: 1 } : {}}
          >
            <div className="material_ui_dark_button">
              <div>
                Send Facebook Direct Message
              </div>
            </div>
          </FacebookMessengerShareButton>
        </div>
      </Wrapper>
    );
  }
}
SendFacebookDirectMessageButton.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  mobileMode: PropTypes.bool,
};

const styles = () => ({
});

const Wrapper = styled.div`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(SendFacebookDirectMessageButton);
