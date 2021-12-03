import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TruncateMarkup from 'react-truncate-markup';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons';
import anonymous from '../../../img/global/icons/avatar-generic.png';
import {
  BlockedIndicator, DraftModeIndicator, EditIndicator,
  IndicatorButtonWrapper, IndicatorDefaultButtonWrapper, IndicatorRow,
} from '../Style/CampaignIndicatorStyles';
import CampaignStore from '../../stores/CampaignStore';
import historyPush from '../../utils/historyPush';
import LazyImage from '../../common/components/LazyImage';
import { renderLog } from '../../common/utils/logging';
import { timeFromDate } from '../../utils/dateFormat';
import { stringContains } from '../../utils/textFormat';

class CampaignNewsItemForList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignNewsSubject: '',
      campaignNewsText: '',
      campaignSEOFriendlyPath: '',
      datePosted: '',
      inDraftMode: true,
      isBlockedByWeVote: false,
      speakerName: '',
      speakerProfileImageUrlTiny: '',
      voterCanEditThisCampaign: false,
    };
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXNewsItemWeVoteId,
    } = this.props;
    // console.log('CampaignNewsItemForList componentDidUpdate, campaignXNewsItemWeVoteId:', campaignXNewsItemWeVoteId);
    const {
      campaignXNewsItemWeVoteId: campaignXNewsItemWeVoteIdPrevious,
    } = prevProps;
    if (campaignXNewsItemWeVoteId) {
      if (campaignXNewsItemWeVoteId !== campaignXNewsItemWeVoteIdPrevious) {
        // console.log('CampaignNewsItemList componentDidUpdate campaignXWeVoteId change');
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXNewsItemWeVoteId, campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    const campaignXNewsItem = CampaignStore.getCampaignXNewsItemByWeVoteId(campaignXNewsItemWeVoteId);
    const voterCanEditThisCampaign = CampaignStore.getVoterCanEditThisCampaign(campaignXWeVoteId);
    // console.log('onCampaignStoreChange campaignXNewsItem:', campaignXNewsItem);
    const {
      seo_friendly_path: campaignSEOFriendlyPath,
    } = campaignX;
    const {
      campaign_news_subject: campaignNewsSubject,
      campaign_news_text: campaignNewsText,
      date_posted: datePosted,
      in_draft_mode: inDraftMode,
      is_blocked_by_we_vote: isBlockedByWeVote,
      speaker_name: speakerName,
      we_vote_hosted_profile_image_url_tiny: speakerProfileImageUrlTiny,
    } = campaignXNewsItem;
    this.setState({
      campaignNewsSubject,
      campaignNewsText,
      campaignSEOFriendlyPath,
      datePosted,
      inDraftMode,
      isBlockedByWeVote,
      speakerName,
      speakerProfileImageUrlTiny,
      voterCanEditThisCampaign,
    });
  }

  getCampaignBasePath = () => {
    const { campaignXWeVoteId } = this.props;
    const { campaignSEOFriendlyPath } = this.state;
    let campaignBasePath;
    if (campaignSEOFriendlyPath) {
      campaignBasePath = `/c/${campaignSEOFriendlyPath}`;
    } else {
      campaignBasePath = `/id/${campaignXWeVoteId}`;
    }
    return campaignBasePath;
  }

  onCampaignNewsItemDraftOrBlockedClick = () => {
    const { campaignXNewsItemWeVoteId } = this.props;
    historyPush(`${this.getCampaignBasePath()}/add-update/${campaignXNewsItemWeVoteId}`);
    return null;
  }

  onCampaignNewsItemEditClick = () => {
    const { campaignXNewsItemWeVoteId } = this.props;
    historyPush(`${this.getCampaignBasePath()}/add-update/${campaignXNewsItemWeVoteId}`);
    return null;
  }

  onCampaignNewsItemShareClick = () => {
    const { campaignXNewsItemWeVoteId } = this.props;
    historyPush(`${this.getCampaignBasePath()}/share-it/${campaignXNewsItemWeVoteId}`);
    return null;
  }

  goToDedicatedPublicNewsItemPage = () => {
    const { campaignXNewsItemWeVoteId } = this.props;
    historyPush(`${this.getCampaignBasePath()}/u/${campaignXNewsItemWeVoteId}`);
    return null;
  }

  render () {
    renderLog('CampaignNewsItemForList');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignXNewsItemWeVoteId, classes } = this.props;
    const {
      campaignNewsSubject,
      campaignNewsText,
      datePosted,
      inDraftMode,
      isBlockedByWeVote,
      speakerName,
      speakerProfileImageUrlTiny,
      voterCanEditThisCampaign,
    } = this.state;
    if (!campaignNewsSubject && !campaignNewsText) {
      return null;
    }
    return (
      <Wrapper>
        <OneCampaignOuterWrapper>
          <OneCampaignInnerWrapper>
            <NewsItemWrapper className="comment" key={campaignXNewsItemWeVoteId}>
              {campaignNewsSubject && (
                <NewsItemSubjectWrapper className="u-cursor--pointer u-link-color-on-hover u-link-underline-on-hover" onClick={this.goToDedicatedPublicNewsItemPage}>
                  {campaignNewsSubject}
                </NewsItemSubjectWrapper>
              )}
              {campaignNewsText && (
                <NewsItemTextWrapper className="u-cursor--pointer u-link-color-on-hover" onClick={this.goToDedicatedPublicNewsItemPage}>
                  <TruncateMarkup
                    ellipsis={(
                      <span>
                        <span className="u-text-fade-at-end">&nbsp;</span>
                        <span
                          className="u-cursor--pointer u-link-underline u-link-color--gray u-link-color-on-hover"
                        >
                          Read more
                        </span>
                      </span>
                    )}
                    lines={4}
                    tokenize="words"
                  >
                    <div>
                      {campaignNewsText}
                    </div>
                  </TruncateMarkup>
                </NewsItemTextWrapper>
              )}
              <SpeakerAndPhotoOuterWrapper>
                <SpeakerVoterPhotoWrapper>
                  {speakerProfileImageUrlTiny ? (
                    <LazyImage
                      src={speakerProfileImageUrlTiny}
                      placeholder={anonymous}
                      className="profile-photo"
                      height={48}
                      width={48}
                      alt="Your Settings"
                    />
                  ) : (
                    <AccountCircle classes={{ root: classes.accountCircleRoot }} />
                  )}
                </SpeakerVoterPhotoWrapper>
                <SpeakerAndTimeWrapper>
                  {!stringContains('Voter-', speakerName) && (
                    <SpeakerName>
                      {speakerName}
                      {' '}
                      <br />
                    </SpeakerName>
                  )}
                  {timeFromDate(datePosted)}
                </SpeakerAndTimeWrapper>
              </SpeakerAndPhotoOuterWrapper>
              <IndicatorRow>
                {isBlockedByWeVote && (
                  <IndicatorButtonWrapper>
                    <BlockedIndicator onClick={this.onCampaignNewsItemDraftOrBlockedClick}>
                      Blocked: Changes Needed
                    </BlockedIndicator>
                  </IndicatorButtonWrapper>
                )}
              </IndicatorRow>
              <IndicatorRow>
                {inDraftMode && (
                  <IndicatorDefaultButtonWrapper onClick={this.onCampaignNewsItemDraftOrBlockedClick}>
                    <DraftModeIndicator>
                      Draft
                    </DraftModeIndicator>
                  </IndicatorDefaultButtonWrapper>
                )}
                {voterCanEditThisCampaign && (
                  <IndicatorButtonWrapper>
                    <EditIndicator onClick={this.onCampaignNewsItemEditClick}>
                      <span className="u-show-mobile">
                        Edit
                      </span>
                      <span className="u-show-desktop-tablet">
                        Edit This Update
                      </span>
                    </EditIndicator>
                  </IndicatorButtonWrapper>
                )}
                <IndicatorButtonWrapper>
                  <EditIndicator onClick={this.onCampaignNewsItemShareClick}>
                    <span className="u-show-mobile">
                      Share
                    </span>
                    <span className="u-show-desktop-tablet">
                      Share This
                    </span>
                  </EditIndicator>
                </IndicatorButtonWrapper>
              </IndicatorRow>
            </NewsItemWrapper>
          </OneCampaignInnerWrapper>
        </OneCampaignOuterWrapper>
      </Wrapper>
    );
  }
}
CampaignNewsItemForList.propTypes = {
  campaignXNewsItemWeVoteId: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  accountCircleRoot: {
    color: '#999',
    height: 48,
    marginRight: 8,
    width: 48,
  },
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const NewsItemSubjectWrapper = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  margin-bottom: 8px;
`;

const NewsItemTextWrapper = styled.div`
  font-size: 16px;
  line-height: 1.4;
  margin: 0;
  margin-bottom: 8px;
`;

const NewsItemWrapper = styled.div`
  border-radius: 10px;
  border-top-left-radius: 0;
  margin: 0;
  width: 100%;
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
  margin-top: 15px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`;

const SpeakerAndTimeWrapper = styled.div`
  color: #999;
  font-size: 12px;
`;

const SpeakerAndPhotoOuterWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
`;

const SpeakerName = styled.span`
  color: #808080;
  font-weight: 500 !important;
`;

const SpeakerVoterPhotoWrapper = styled.div`
  margin-right: 6px;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(CampaignNewsItemForList);
