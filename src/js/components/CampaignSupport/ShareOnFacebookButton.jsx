import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { FacebookShareButton } from 'react-share';
import CampaignStore from '../../stores/CampaignStore';
import { isAndroid, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { androidFacebookClickHandler } from '../Share/shareButtonCommon';

class ShareOnFacebookButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignX: {},
    };
  }

  componentDidMount () {
    // console.log('CampaignCardForList componentDidMount');
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    this.setState({
      campaignX,
    });
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
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    this.setState({
      campaignX,
    });
  }

  generateFullCampaignLink = () => {
    const { hostname } = window.location;
    let domainAddress;
    if (hostname === 'localhost') {
      domainAddress = `https://${hostname}:3000`;
    } else {
      domainAddress = `https://${hostname}`;
    }
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

  saveActionShareButtonFacebook = () => {
    //
  }

  render () {
    renderLog('ShareOnFacebookButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`ShareOnFacebookButton window.location.href: ${window.location.href}`);
    }
    const { mobileMode } = this.props;
    const { campaignX } = this.state;
    const {
      campaign_description: campaignDescription,
      campaign_title: campaignTitle,
      campaignx_we_vote_id: campaignXWeVoteId,
      in_draft_mode: inDraftMode,
      supporters_count: supportersCount,
      visible_on_this_site: visibleOnThisSite,
      we_vote_hosted_campaign_photo_medium_url: CampaignPhotoMediumUrl,
    } = campaignX;
    let linkToBeShared = this.generateFullCampaignLink();
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
            className={mobileMode ? 'material_ui_button_mobile' : ''}
            id="shareModalFacebookButton"
            onClick={this.saveActionShareButtonFacebook}
            quote={campaignTitle}
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
