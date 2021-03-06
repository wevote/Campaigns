import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { EmailShareButton } from 'react-share';
import CampaignStore from '../../stores/CampaignStore';
import { isAndroid, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import {
  cordovaSocialSharingByEmail,
  generateQuoteForSharing,
} from './shareButtonCommon';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';

class ShareByEmailButton extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignX: {},
      numberOfPoliticians: 0,
      politicianListSentenceString: '',
    };
  }

  componentDidMount () {
    // console.log('ShareByEmailButton componentDidMount');
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('ShareByEmailButton componentDidUpdate');
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
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    let numberOfPoliticians = 0;
    if (campaignXPoliticianList && campaignXPoliticianList.length > 0) {
      numberOfPoliticians = campaignXPoliticianList.length;
    }
    let politicianListSentenceString = '';
    if (numberOfPoliticians > 0) {
      politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
    }
    // console.log('onCampaignStoreChange politicianListSentenceString:', politicianListSentenceString);
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
    renderLog('ShareByEmailButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`ShareByEmailButton window.location.href: ${window.location.href}`);
    }
    const { darkButton, mobileMode } = this.props;
    const { campaignX, numberOfPoliticians, politicianListSentenceString } = this.state;
    const {
      campaign_title: campaignTitle,
    } = campaignX;
    let linkToBeShared = this.generateFullCampaignLink();
    linkToBeShared = linkToBeShared.replace('https://file:/', 'https://campaigns.wevote.us/');  // Cordova
    const quoteForSharing = generateQuoteForSharing(campaignTitle, numberOfPoliticians, politicianListSentenceString);
    // console.log('quoteForSharing:', quoteForSharing);
    const quoteForSharingEncoded = encodeURI(quoteForSharing);
    let subjectForSharing = `Vote for${politicianListSentenceString}`;
    if (subjectForSharing) {
      subjectForSharing = subjectForSharing.trim();
    }
    const subjectForSharingEncoded = encodeURI(subjectForSharing);
    // console.log('subjectForSharing:', subjectForSharing);
    return (
      <Wrapper>
        <div id="androidEmail"
             onClick={() => isAndroid() &&
               cordovaSocialSharingByEmail(subjectForSharingEncoded, quoteForSharingEncoded)}
        >
          <EmailShareButton
            className={mobileMode ? 'material_ui_button_mobile' : ''}
            id="shareByEmailButton"
            onClick={this.saveActionShareButton}
            body={quoteForSharing}
            openShareDialogOnClick
            subject={subjectForSharing}
            url={linkToBeShared}
            windowWidth={mobileMode ? 350 : 750}
            windowHeight={mobileMode ? 600 : 600}
            disabled={isAndroid()}
            disabledStyle={isAndroid() ? { opacity: 1 } : {}}
          >
            <div className={darkButton ? 'material_ui_dark_button' : 'material_ui_light_button'}>
              <div>
                Share by Email
              </div>
            </div>
          </EmailShareButton>
        </div>
      </Wrapper>
    );
  }
}
ShareByEmailButton.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  darkButton: PropTypes.bool,
  mobileMode: PropTypes.bool,
};

const styles = () => ({
});

const Wrapper = styled.div`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(ShareByEmailButton);
