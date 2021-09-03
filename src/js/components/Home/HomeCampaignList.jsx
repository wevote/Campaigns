import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignCardForList from '../Campaign/CampaignCardForList';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';
import { renderLog } from '../../utils/logging';

const FirstCampaignListController = React.lazy(() => import('../Campaign/FirstCampaignListController'));

const STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY = 3;
const STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY_MOBILE = 2;

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
    } else if (isMobileScreenSize()) {
      // We deviate from pure Responsive because reducing the campaigns down to 2 for mobile eliminate retrieving an extra image
      this.setState({
        numberOfCampaignsToDisplay: STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY_MOBILE,
      });
    }
    this.onCampaignStoreChange();
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onCampaignSupporterStoreChange () {
    // We need to instantiate CampaignSupporterStore before we call campaignListRetrieve so that store gets filled with data
  }

  onCampaignStoreChange () {
    const promotedCampaignListUnsorted = CampaignStore.getPromotedCampaignXDicts();
    const promotedCampaignList = promotedCampaignListUnsorted.sort(this.orderBySupportersCount);
    this.setState({
      promotedCampaignList,
    });
  }

  orderBySupportersCount = (firstCampaign, secondCampaign) => secondCampaign.supporters_count - firstCampaign.supporters_count;

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
    const { hideTitle } = this.props;
    const { promotedCampaignList, numberOfCampaignsToDisplay } = this.state;

    if (!promotedCampaignList) {
      return null;
    }
    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        {!!(!hideTitle &&
            promotedCampaignList &&
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
        {/* {!numberOfCampaignsDisplayed && ( */}
        {/*  <DelayedLoad waitBeforeShow={2000}> */}
        {/*    <CampaignsNotAvailableToShow> */}
        {/*      We don&apos;t have any upcoming campaigns to show. Please try again later! */}
        {/*    </CampaignsNotAvailableToShow> */}
        {/*  </DelayedLoad> */}
        {/* )} */}
        <Suspense fallback={<span>&nbsp;</span>}>
          <FirstCampaignListController />
        </Suspense>
      </Wrapper>
    );
  }
}
HomeCampaignList.propTypes = {
  hideTitle: PropTypes.bool,
  startingNumberOfCampaignsToDisplay: PropTypes.number,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

// const CampaignsNotAvailableToShow = styled.div`
//   color: #555;
//   font-size: 18px;
//   text-align: center;
//   margin: 0 2em 6em;
//   @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
//     font-size: 16px;
//     margin: 0 1em 5em;
//   }
// `;

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
