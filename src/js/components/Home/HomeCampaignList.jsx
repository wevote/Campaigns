import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignCardForList from '../Campaign/CampaignCardForList';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';
import { renderLog } from '../../utils/logging';

const FirstCampaignListController = React.lazy(() => import('../Campaign/FirstCampaignListController'));

const STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY = 3;

class HomeCampaignList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      numberOfCampaignsToDisplay: STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('HomeCampaignList componentDidMount');
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    if (this.props.startingNumberOfCampaignsToDisplay && this.props.startingNumberOfCampaignsToDisplay > 0) {
      this.setState({
        numberOfCampaignsToDisplay: this.props.startingNumberOfCampaignsToDisplay,
      });
    }
    const promotedCampaignList = CampaignStore.getPromotedCampaignXDicts();
    this.setState({
      promotedCampaignList,
    });
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onCampaignSupporterStoreChange () {
    // We need to instantiate CampaignSupporterStore before we call campaignListRetrieve so that store gets filled with data
  }

  onCampaignStoreChange () {
    const promotedCampaignList = CampaignStore.getPromotedCampaignXDicts();
    this.setState({
      promotedCampaignList,
    });
  }

  increaseNumberOfCampaignsToDisplay = () => {
    let { numberOfCampaignsToDisplay } = this.state;
    numberOfCampaignsToDisplay += 2;
    this.setState({
      numberOfCampaignsToDisplay,
    });
  }

  render () {
    renderLog('HomeCampaignList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('HomeCampaignList render');
    const { promotedCampaignList, numberOfCampaignsToDisplay } = this.state;

    if (!promotedCampaignList) {
      return null;
    }
    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        {!!(promotedCampaignList &&
            promotedCampaignList.length > 1) &&
        (
          <WhatIsHappeningTitle>
            What&apos;s happening on WeVote.US
          </WhatIsHappeningTitle>
        )}
        <div>
          {promotedCampaignList.map((oneCampaign) => {
            // console.log('oneCampaign:', oneCampaign);
            // console.log('numberOfCampaignsDisplayed:', numberOfCampaignsDisplayed);
            if (numberOfCampaignsDisplayed >= numberOfCampaignsToDisplay) {
              return null;
            }
            numberOfCampaignsDisplayed += 1;
            // console.log('numberOfCampaignsDisplayed: ', numberOfCampaignsDisplayed);
            // console.log('numberOfCampaignsToDisplay: ', numberOfCampaignsToDisplay);
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
          {!!(promotedCampaignList &&
              promotedCampaignList.length > 1 &&
              numberOfCampaignsToDisplay < promotedCampaignList.length) &&
          (
            <LoadMoreItemsManually
              loadMoreFunction={this.increaseNumberOfCampaignsToDisplay}
              uniqueExternalId="HomeCampaignList"
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
HomeCampaignList.propTypes = {
  startingNumberOfCampaignsToDisplay: PropTypes.number,
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

const WhatIsHappeningTitle = styled.h2`
  font-size: 22px;
  text-align: left;
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(HomeCampaignList);
