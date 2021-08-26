import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  CampaignSupportDesktopButtonPanel, CampaignSupportDesktopButtonWrapper,
  CampaignSupportMobileButtonPanel, CampaignSupportMobileButtonWrapper,
  CampaignSupportSection, CampaignSupportSectionWrapper,
} from '../Style/CampaignSupportStyles';
import { isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import ShareByCopyLink from '../Share/ShareByCopyLink';
import ShareByEmailButton from '../Share/ShareByEmailButton';
import ShareOnFacebookButton from '../Share/ShareOnFacebookButton';
import ShareOnTwitterButton from '../Share/ShareOnTwitterButton';


class CampaignShareChunk extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignShareChunk componentDidMount');
  }

  render () {
    renderLog('CampaignShareChunk');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignShareChunk window.location.href: ${window.location.href}`);
    }
    const { campaignXNewsItemWeVoteId, campaignXWeVoteId, darkButtonsOff } = this.props;
    return (
      <div>
        <CampaignSupportSectionWrapper>
          <CampaignSupportSection>
            <CampaignSupportDesktopButtonWrapper>
              <CampaignSupportDesktopButtonPanel>
                <PublicOrPrivateSectionHeader>Share privately. </PublicOrPrivateSectionHeader>
                <PublicOrPrivateSectionText>
                  Share 1-on-1 with friends who share your values.
                </PublicOrPrivateSectionText>
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
              <CampaignSupportDesktopButtonPanel>
                <ShareByEmailButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} darkButton={!darkButtonsOff} />
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportMobileButtonWrapper className="u-show-mobile">
              <CampaignSupportMobileButtonPanel>
                <ShareByEmailButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} darkButton={!darkButtonsOff} mobileMode />
              </CampaignSupportMobileButtonPanel>
            </CampaignSupportMobileButtonWrapper>
            <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
              <CampaignSupportDesktopButtonPanel>
                <ShareByCopyLink campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} />
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportMobileButtonWrapper className="u-show-mobile">
              <CampaignSupportMobileButtonPanel>
                <ShareByCopyLink campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} mobileMode />
              </CampaignSupportMobileButtonPanel>
            </CampaignSupportMobileButtonWrapper>
          </CampaignSupportSection>
        </CampaignSupportSectionWrapper>
        <CampaignSupportSectionWrapper>
          <CampaignSupportSection>
            <CampaignSupportDesktopButtonWrapper>
              <CampaignSupportDesktopButtonPanel>
                <PublicOrPrivateSectionHeader>Share publicly. </PublicOrPrivateSectionHeader>
                <PublicOrPrivateSectionText>
                  Share with everyone and make your voice heard.
                </PublicOrPrivateSectionText>
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
              <CampaignSupportDesktopButtonPanel>
                <ShareOnFacebookButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} darkButton={!darkButtonsOff} />
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportMobileButtonWrapper className="u-show-mobile">
              <CampaignSupportMobileButtonPanel>
                <ShareOnFacebookButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} mobileMode />
              </CampaignSupportMobileButtonPanel>
            </CampaignSupportMobileButtonWrapper>
            <CampaignSupportDesktopButtonWrapper className="u-show-desktop-tablet">
              <CampaignSupportDesktopButtonPanel>
                <ShareOnTwitterButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} />
              </CampaignSupportDesktopButtonPanel>
            </CampaignSupportDesktopButtonWrapper>
            <CampaignSupportMobileButtonWrapper className="u-show-mobile">
              <CampaignSupportMobileButtonPanel>
                <ShareOnTwitterButton campaignXNewsItemWeVoteId={campaignXNewsItemWeVoteId} campaignXWeVoteId={campaignXWeVoteId} mobileMode />
              </CampaignSupportMobileButtonPanel>
            </CampaignSupportMobileButtonWrapper>
          </CampaignSupportSection>
        </CampaignSupportSectionWrapper>
      </div>
    );
  }
}
CampaignShareChunk.propTypes = {
  campaignXNewsItemWeVoteId: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  darkButtonsOff: PropTypes.bool,
};

const PublicOrPrivateSectionHeader = styled.span`
  font-weight: 600;
`;

const PublicOrPrivateSectionText = styled.span`
  color: #999;
`;

export default CampaignShareChunk;
