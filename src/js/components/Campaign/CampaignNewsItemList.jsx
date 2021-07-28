import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignNewsItemForList from './CampaignNewsItemForList';
import CampaignStore from '../../stores/CampaignStore';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';
import { renderLog } from '../../utils/logging';

const STARTING_NUMBER_OF_NEWS_ITEMS_TO_DISPLAY = 1;

const CampaignNewsItemCreateButton = React.lazy(() => import('../../components/CampaignNewsItemPublish/CampaignNewsItemCreateButton'));

class CampaignNewsItemList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXNewsItemList: [],
      numberOfNewsItemsToDisplay: STARTING_NUMBER_OF_NEWS_ITEMS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { startingNumberOfNewsItemsToDisplay } = this.props;
    if (startingNumberOfNewsItemsToDisplay && startingNumberOfNewsItemsToDisplay > 0) {
      this.setState({
        numberOfNewsItemsToDisplay: startingNumberOfNewsItemsToDisplay,
      });
    }
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignNewsItemList componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        const campaignXNewsItemList = CampaignStore.getCampaignXNewsItemList(campaignXWeVoteId);
        this.setState({
          campaignXNewsItemList,
        });
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const voterCanEditThisCampaign = CampaignStore.getVoterCanEditThisCampaign(campaignXWeVoteId);
    const campaignXNewsItemList = CampaignStore.getCampaignXNewsItemList(campaignXWeVoteId);
    this.setState({
      campaignXNewsItemList,
      voterCanEditThisCampaign,
    });
  }

  increaseNumberOfNewsItemsToDisplay = () => {
    let { numberOfNewsItemsToDisplay } = this.state;
    numberOfNewsItemsToDisplay += 2;
    this.setState({
      numberOfNewsItemsToDisplay,
    });
  }

  render () {
    renderLog('CampaignNewsItemList');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignSEOFriendlyPath, campaignXWeVoteId, hideEncouragementToComment, showAddNewsItemIfNeeded } = this.props;
    const { campaignXNewsItemList, numberOfNewsItemsToDisplay, voterCanEditThisCampaign } = this.state;

    if (!campaignXNewsItemList || campaignXNewsItemList.length === 0) {
      if (voterCanEditThisCampaign && showAddNewsItemIfNeeded) {
        return (
          <Wrapper>
            <UpdateSupportersWrapper>
              No updates have been published yet. Post the first update!
              <br />
              <br />
              <Suspense fallback={<span>&nbsp;</span>}>
                <CampaignNewsItemCreateButton
                  campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                  campaignXWeVoteId={campaignXWeVoteId}
                />
              </Suspense>
            </UpdateSupportersWrapper>
          </Wrapper>
        );
      } else {
        return (
          <Wrapper>
            {!hideEncouragementToComment && (
              <NoNewsFound>
                No updates have been published yet. Stay tuned!
              </NoNewsFound>
            )}
          </Wrapper>
        );
      }
    }
    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        <div>
          {campaignXNewsItemList.map((campaignXNewsItem) => {
            // console.log('campaignXNewsItem:', campaignXNewsItem, ', numberOfCampaignsDisplayed:', numberOfCampaignsDisplayed, ', numberOfNewsItemsToDisplay:', numberOfNewsItemsToDisplay);
            if (numberOfCampaignsDisplayed >= numberOfNewsItemsToDisplay) {
              return null;
            }
            numberOfCampaignsDisplayed += 1;
            return (
              <div key={`campaignXNewsItem-${campaignXWeVoteId}-${campaignXNewsItem.campaignx_news_item_we_vote_id}`}>
                <CampaignNewsItemForList
                  campaignXWeVoteId={campaignXWeVoteId}
                  campaignXNewsItemWeVoteId={campaignXNewsItem.campaignx_news_item_we_vote_id}
                />
              </div>
            );
          })}
        </div>
        <LoadMoreItemsManuallyWrapper>
          {!!(campaignXNewsItemList &&
              campaignXNewsItemList.length > 1 &&
              numberOfNewsItemsToDisplay < campaignXNewsItemList.length) &&
          (
            <LoadMoreItemsManually
              loadMoreFunction={this.increaseNumberOfNewsItemsToDisplay}
              uniqueExternalId="CampaignNewsItemList"
            />
          )}
        </LoadMoreItemsManuallyWrapper>
      </Wrapper>
    );
  }
}
CampaignNewsItemList.propTypes = {
  campaignSEOFriendlyPath: PropTypes.string,
  campaignXWeVoteId: PropTypes.string,
  hideEncouragementToComment: PropTypes.bool,
  showAddNewsItemIfNeeded: PropTypes.bool,
  startingNumberOfNewsItemsToDisplay: PropTypes.number,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const LoadMoreItemsManuallyWrapper = styled.div`
  margin-bottom: 0px;
  @media print{
    display: none;
  }
`;

const NoNewsFound = styled.div`
  border-top: 1px solid #ddd;
  margin-top: 25px;
  padding-top: 25px;
`;

const UpdateSupportersWrapper = styled.div`
  border-top: 1px solid #ddd;
  margin-top: 25px;
  padding-top: 25px;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(CampaignNewsItemList);
