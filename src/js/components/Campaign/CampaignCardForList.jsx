import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TruncateMarkup from 'react-truncate-markup';
import { withStyles } from '@material-ui/core/styles';
import CampaignStore from '../../stores/CampaignStore';
import { renderLog } from '../../utils/logging';
import { historyPush, isCordova } from '../../utils/cordovaUtils';

class CampaignCardForList extends Component {
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

  onCampaignClick = () => {
    const { campaignX } = this.state;
    // console.log('campaignX:', campaignX);
    if (!campaignX) {
      return null;
    }
    const {
      in_draft_mode: inDraftMode,
      seo_friendly_path: SEOFriendlyPath,
      campaignx_we_vote_id: campaignXWeVoteId,
    } = campaignX;
    if (inDraftMode) {
      historyPush('/start-a-campaign-preview');
    } else if (SEOFriendlyPath) {
      historyPush(`/c/${SEOFriendlyPath}`);
    } else {
      historyPush(`/id/${campaignXWeVoteId}`);
    }
    return null;
  }

  render () {
    renderLog('CampaignCardForList');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignCardForList window.location.href: ${window.location.href}`);
    }
    const { campaignX } = this.state;
    if (!campaignX) {
      return null;
    }
    const {
      campaign_description: campaignDescription,
      campaign_title: campaignTitle,
      in_draft_mode: inDraftMode,
      visible_on_this_site: visibleOnThisSite,
      we_vote_hosted_campaign_photo_medium_url: CampaignPhotoMediumUrl,
    } = campaignX;
    return (
      <Wrapper cordova={isCordova()}>
        <OneCampaignOuterWrapper onClick={this.onCampaignClick}>
          <OneCampaignInnerWrapper>
            <OneCampaignTextColumn>
              {inDraftMode && (
                <DraftModeWrapper>
                  <DraftModeIndicator>
                    Draft
                  </DraftModeIndicator>
                </DraftModeWrapper>
              )}
              {!visibleOnThisSite && (
                <DraftModeWrapper>
                  <DraftModeIndicator>
                    Not Visible On This Site
                  </DraftModeIndicator>
                </DraftModeWrapper>
              )}
              <OneCampaignTitle>
                {campaignTitle}
              </OneCampaignTitle>
              <OneCampaignDescription>
                <TruncateMarkup lines={4}>
                  <div>
                    {campaignDescription}
                  </div>
                </TruncateMarkup>
              </OneCampaignDescription>
            </OneCampaignTextColumn>
            <OneCampaignPhotoColumn>
              {CampaignPhotoMediumUrl && (
                <CampaignImage src={CampaignPhotoMediumUrl} alt="Campaign" />
              )}
            </OneCampaignPhotoColumn>
          </OneCampaignInnerWrapper>
        </OneCampaignOuterWrapper>
      </Wrapper>
    );
  }
}
CampaignCardForList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  // classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const DraftModeIndicator = styled.span`
  background-color: #ccc;
  border-radius: 5px;
  font-size: 14px;
  padding: 3px 30px;
`;

const DraftModeWrapper = styled.div`
  margin-bottom: 12px;
`;

const OneCampaignDescription = styled.div`
  font-size: 14px;
  margin: 4px 0;
`;

const OneCampaignInnerWrapper = styled.div`
  margin: 15px 0;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
    justify-content: space-between;
    margin: 15px;
  }
`;

const OneCampaignOuterWrapper = styled.div`
  border-top: 1px solid #ddd;
  cursor: pointer;
  margin-top: 15px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`;

const OneCampaignPhotoColumn = styled.div`
`;

const OneCampaignTextColumn = styled.div`
`;

const OneCampaignTitle = styled.h1`
  font-size: 18px;
  margin: 0;
`;

const CampaignImage = styled.img`
  border-radius: 5px;
  margin-top: 8px;
  min-height: 175px;
  width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-left: 15px;
    margin-top: 0;
    min-height: 130px;
    width: 225px;
  }
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(CampaignCardForList);
