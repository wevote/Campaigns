import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignCommentForList from './CampaignCommentForList';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';
import { renderLog } from '../../utils/logging';

const STARTING_NUMBER_OF_COMMENTS_TO_DISPLAY = 10;

class CampaignCommentsList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      numberOfCommentsToDisplay: STARTING_NUMBER_OF_COMMENTS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    const { campaignXWeVoteId, startingNumberOfCommentsToDisplay } = this.props;
    // console.log('CampaignCommentsList componentDidMount campaignXWeVoteId:', campaignXWeVoteId);
    if (startingNumberOfCommentsToDisplay && startingNumberOfCommentsToDisplay > 0) {
      this.setState({
        numberOfCommentsToDisplay: startingNumberOfCommentsToDisplay,
      });
    }
    const supporterEndorsementsList = CampaignSupporterStore.getCampaignXSupporterEndorsementsList(campaignXWeVoteId);
    this.setState({
      supporterEndorsementsList,
    });
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignCommentsList componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        const supporterEndorsementsList = CampaignSupporterStore.getCampaignXSupporterEndorsementsList(campaignXWeVoteId);
        this.setState({
          supporterEndorsementsList,
        });
      }
    }
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.props;
    // console.log('CampaignCommentsList onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId);
    const supporterEndorsementsList = CampaignSupporterStore.getCampaignXSupporterEndorsementsList(campaignXWeVoteId);
    this.setState({
      supporterEndorsementsList,
    });
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    // console.log('CampaignCommentsList onCampaignStoreChange campaignXWeVoteId:', campaignXWeVoteId);
    const supporterEndorsementsList = CampaignSupporterStore.getCampaignXSupporterEndorsementsList(campaignXWeVoteId);
    this.setState({
      supporterEndorsementsList,
    });
  }

  increaseNumberOfCampaignsToDisplay = () => {
    let { numberOfCommentsToDisplay } = this.state;
    numberOfCommentsToDisplay += 2;
    this.setState({
      numberOfCommentsToDisplay,
    });
  }

  render () {
    renderLog('CampaignCommentsList');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignXWeVoteId, hideEncouragementToComment } = this.props;
    const { supporterEndorsementsList, numberOfCommentsToDisplay } = this.state;
    // console.log('CampaignCommentsList render numberOfCommentsToDisplay:', numberOfCommentsToDisplay);

    if (!supporterEndorsementsList || supporterEndorsementsList.length === 0) {
      return (
        <Wrapper>
          {!hideEncouragementToComment && (
            <NoCommentsFound>
              Be the first to add a comment! Anyone who supports this campaign may share their reasons.
            </NoCommentsFound>
          )}
        </Wrapper>
      );
    }
    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        <div>
          {supporterEndorsementsList.map((campaignXSupporter) => {
            // console.log('campaignXSupporter:', campaignXSupporter);
            if (numberOfCampaignsDisplayed >= numberOfCommentsToDisplay) {
              return null;
            }
            numberOfCampaignsDisplayed += 1;
            return (
              <div key={`campaignXSupporterItem-${campaignXWeVoteId}-${campaignXSupporter.voter_we_vote_id}`}>
                <CampaignCommentForList
                  campaignXWeVoteId={campaignXWeVoteId}
                  campaignXSupporterId={campaignXSupporter.id}
                />
              </div>
            );
          })}
        </div>
        <LoadMoreItemsManuallyWrapper>
          {!!(supporterEndorsementsList &&
              supporterEndorsementsList.length > 1 &&
              numberOfCommentsToDisplay < supporterEndorsementsList.length) &&
          (
            <LoadMoreItemsManually
              loadMoreFunction={this.increaseNumberOfCampaignsToDisplay}
              uniqueExternalId="CampaignCommentsList"
            />
          )}
        </LoadMoreItemsManuallyWrapper>
      </Wrapper>
    );
  }
}
CampaignCommentsList.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  hideEncouragementToComment: PropTypes.bool,
  startingNumberOfCommentsToDisplay: PropTypes.number,
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

const NoCommentsFound = styled.div`
  border-top: 1px solid #ddd;
  margin-top: 25px;
  padding-top: 25px;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(CampaignCommentsList);
