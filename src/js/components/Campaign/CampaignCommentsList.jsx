import React, { Component, Suspense } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignCardForList from './CampaignCardForList';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';
import { renderLog } from '../../utils/logging';

const FirstCampaignListController = React.lazy(() => import('./FirstCampaignListController'));

const STARTING_NUMBER_OF_COMMENTS_TO_DISPLAY = 10;

class CampaignCommentsList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      numberOfCommentsToDisplay: STARTING_NUMBER_OF_COMMENTS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('CampaignCommentsList componentDidMount');
    this.campaignSupportStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    if (this.props.startingNumberOfCommentsToDisplay && this.props.startingNumberOfCommentsToDisplay > 0) {
      this.setState({
        numberOfCommentsToDisplay: this.props.startingNumberOfCommentsToDisplay,
      });
    }
    const supporterEndorsementsList = CampaignSupporterStore.getCampaignXSupporterEndorsementsList();
    this.setState({
      supporterEndorsementsList,
    });
  }

  componentWillUnmount () {
    this.campaignSupportStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onCampaignSupporterStoreChange () {
    const supporterEndorsementsList = CampaignSupporterStore.getCampaignXSupporterEndorsementsList();
    this.setState({
      supporterEndorsementsList,
    });
  }

  onCampaignStoreChange () {
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
    // console.log('CampaignCommentsList render');
    const { supporterEndorsementsList, numberOfCommentsToDisplay } = this.state;

    if (!supporterEndorsementsList || supporterEndorsementsList.length === 0) {
      return (
        <Wrapper>
          <NoCommentsFound>
            Be the first to add a comment!
            {' '}
            Click &apos;Campaign details&apos; above
            {' '}
            to support this campaign so you can add a comment.
          </NoCommentsFound>
        </Wrapper>
      );
    }
    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        <div>
          {supporterEndorsementsList.map((oneCampaign) => {
            // console.log('oneCampaign:', oneCampaign);
            // console.log('numberOfCampaignsDisplayed:', numberOfCampaignsDisplayed);
            if (numberOfCampaignsDisplayed >= numberOfCommentsToDisplay) {
              return null;
            }
            numberOfCampaignsDisplayed += 1;
            // console.log('numberOfCampaignsDisplayed: ', numberOfCampaignsDisplayed);
            // console.log('numberOfCommentsToDisplay: ', numberOfCommentsToDisplay);
            return (
              <div key={`oneCampaignItem-${oneCampaign.campaignx_we_vote_id}`}>
                <CampaignCardForList
                  campaignXWeVoteId={oneCampaign.campaignx_we_vote_id}
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
        <Suspense fallback={<span>&nbsp;</span>}>
          <FirstCampaignListController />
        </Suspense>
      </Wrapper>
    );
  }
}
CampaignCommentsList.propTypes = {
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

const WhatIsHappeningTitle = styled.h2`
  font-size: 22px;
  text-align: left;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(CampaignCommentsList);
