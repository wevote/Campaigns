import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import CampaignCardForList from '../Campaign/CampaignCardForList';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';


const STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY = 6;

class HomeCampaignList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loadingMoreItems: false,
      numberOfCampaignsToDisplay: STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY,
    };
  }

  componentDidMount () {
    // console.log('HomeCampaignList componentDidMount');
    if (this.props.startingNumberOfPositionsToDisplay && this.props.startingNumberOfPositionsToDisplay > 0) {
      this.setState({
        numberOfCampaignsToDisplay: this.props.startingNumberOfPositionsToDisplay,
      });
    }
    const campaignList = [
      {
        campaign_name: 'Campaign Name',
        campaign_we_vote_id: 'wv02camp999',
      },
    ];
    this.setState({
      campaignList,
    });
  }

  componentWillUnmount () {
    if (this.positionItemTimer) {
      clearTimeout(this.positionItemTimer);
      this.positionItemTimer = null;
    }
  }

  // increaseNumberOfPositionItemsToDisplay = () => {
  //   let { numberOfCampaignsToDisplay } = this.state;
  //   // console.log('Number of position items before increment: ', numberOfCampaignsToDisplay);
  //
  //   numberOfCampaignsToDisplay += 2;
  //   // console.log('Number of position items after increment: ', numberOfCampaignsToDisplay);
  //
  //   this.positionItemTimer = setTimeout(() => {
  //     this.setState({
  //       numberOfCampaignsToDisplay,
  //     });
  //   }, 500);
  // }

  render () {
    // const { organizationWeVoteId } = this.props;
    const { campaignList } = this.state;
    renderLog('HomeCampaignList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('HomeCampaignList render');
    if (!campaignList) {
      // console.log('HomeCampaignList Loading...');
      return null;
    }
    const { loadingMoreItems, numberOfCampaignsToDisplay } = this.state;
    let positionsExist = false;
    let count;
    for (count = 0; count < campaignList.length; count++) {
      positionsExist = true;
    }
    if (!positionsExist) {
      return null;
    }

    let numberOfCampaignsDisplayed = 0;
    return (
      <div>
        <div>
          {campaignList.map((oneCampaign) => {
            // console.log('oneCampaign:', oneCampaign);
            // console.log('numberOfCampaignsDisplayed:', numberOfCampaignsDisplayed);
            if (numberOfCampaignsDisplayed >= numberOfCampaignsToDisplay) {
              return null;
            }
            numberOfCampaignsDisplayed += 1;
            // console.log('numberOfBallotItemsDisplayed: ', numberOfBallotItemsDisplayed);
            return (
              <div key={`oneCampaignItem-${oneCampaign.campaign_we_vote_id}`}>
                <CampaignCardForList
                  campaignWeVoteId={oneCampaign.campaign_we_vote_id}
                />
              </div>
            );
          })}
        </div>
        <LoadMoreItemsManuallyWrapper>
          {/*  onClick={this.increaseNumberOfPositionItemsToDisplay} */}
          {!!(campaignList && campaignList.length > 1) && (
            <LoadMoreItemsManually
              loadingMoreItemsNow={loadingMoreItems}
              numberOfItemsDisplayed={numberOfCampaignsDisplayed}
              numberOfItemsTotal={campaignList.length}
            />
          )}
        </LoadMoreItemsManuallyWrapper>
      </div>
    );
  }
}
HomeCampaignList.propTypes = {
  // organizationWeVoteId: PropTypes.string,
  startingNumberOfPositionsToDisplay: PropTypes.number,
};

const styles = () => ({
  iconButton: {
    padding: 8,
  },
});

const LoadMoreItemsManuallyWrapper = styled.div`
  margin-bottom: 0px;
  padding-left: 16px;
  padding-right: 26px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-right: 16px;
  }
  @media print{
    display: none;
  }
`;

export default withStyles(styles)(HomeCampaignList);
