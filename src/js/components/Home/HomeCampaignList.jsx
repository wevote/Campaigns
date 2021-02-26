import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import CampaignActions from '../../actions/CampaignActions';
import CampaignCardForList from '../Campaign/CampaignCardForList';
import CampaignStore from '../../stores/CampaignStore';
import initializejQuery from '../../utils/initializejQuery';
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
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    initializejQuery(() => {
      CampaignActions.campaignListRetrieve();
    });
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
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const promotedCampaignList = CampaignStore.getPromotedCampaignXDicts();
    this.setState({
      promotedCampaignList,
    });
  }

  // increaseNumberOfPositionItemsToDisplay = () => {
  //   let { numberOfCampaignsToDisplay } = this.state;
  //   numberOfCampaignsToDisplay += 2;
  //   this.setState({
  //     numberOfCampaignsToDisplay,
  //   });
  // }

  render () {
    renderLog('HomeCampaignList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('HomeCampaignList render');
    const { promotedCampaignList, loadingMoreItems, numberOfCampaignsToDisplay } = this.state;

    if (!promotedCampaignList) {
      return null;
    }
    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        <div>
          {promotedCampaignList.map((oneCampaign) => {
            // console.log('oneCampaign:', oneCampaign);
            // console.log('numberOfCampaignsDisplayed:', numberOfCampaignsDisplayed);
            if (numberOfCampaignsDisplayed >= numberOfCampaignsToDisplay) {
              return null;
            }
            numberOfCampaignsDisplayed += 1;
            // console.log('numberOfBallotItemsDisplayed: ', numberOfBallotItemsDisplayed);
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
          {/*  onClick={this.increaseNumberOfPositionItemsToDisplay} */}
          {!!(promotedCampaignList && promotedCampaignList.length > 1) && (
            <LoadMoreItemsManually
              loadingMoreItemsNow={loadingMoreItems}
              numberOfItemsDisplayed={numberOfCampaignsDisplayed}
              numberOfItemsTotal={promotedCampaignList.length}
            />
          )}
        </LoadMoreItemsManuallyWrapper>
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
  padding-left: 16px;
  padding-right: 26px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-right: 16px;
  }
  @media print{
    display: none;
  }
`;

const Wrapper = styled.div`
`;

export default withStyles(styles)(HomeCampaignList);
