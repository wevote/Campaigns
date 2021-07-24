import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { FacebookShareButton } from 'react-share';
import AppStore from '../../stores/AppStore';
import CampaignStore from '../../stores/CampaignStore';
import { isAndroid, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { androidFacebookClickHandler, generateQuoteForSharing } from './shareButtonCommon';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';

class ShareOnFacebookButton extends Component {
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
    // console.log('ShareOnFacebookButton componentDidMount');
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('ShareOnFacebookButton componentDidUpdate');
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
      seo_friendly_path: campaignSEOFriendlyPath,
      campaignx_we_vote_id: campaignXWeVoteId,
    } = campaignX;
    if (campaignSEOFriendlyPath) {
      return `${domainAddress}/c/${campaignSEOFriendlyPath}`;
    } else {
      return `${domainAddress}/id/${campaignXWeVoteId}`;
    }
  }

  saveActionShareButton = () => {
    //
  }

  render () {
    renderLog('ShareOnFacebookButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`ShareOnFacebookButton window.location.href: ${window.location.href}`);
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
          <FacebookShareButton
            className={mobileMode ? 'material_ui_button_mobile' : ''}
            hashtag={inPrivateLabelMode ? null : '#WeVote'}
            id="shareOnFacebookButton"
            onClick={this.saveActionShareButton}
            quote={quoteForSharing}
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
  campaignXWeVoteId: PropTypes.string,
  mobileMode: PropTypes.bool,
};

const styles = () => ({
});

const Wrapper = styled.div`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(ShareOnFacebookButton);
