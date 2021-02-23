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
import startsWith from '../../utils/startsWith';


const STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY = 6;

class SettingsCampaignList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loadingMoreItems: false,
      numberOfCampaignsToDisplay: STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY,
      voterStartedCampaignList: [],
      voterSupportedCampaignList: [],
    };
  }

  componentDidMount () {
    // console.log('SettingsCampaignList componentDidMount');
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    initializejQuery(() => {
      CampaignActions.campaignListRetrieve();
    });
    if (this.props.startingNumberOfCampaignsToDisplay && this.props.startingNumberOfCampaignsToDisplay > 0) {
      this.setState({
        numberOfCampaignsToDisplay: this.props.startingNumberOfCampaignsToDisplay,
      });
    }
    const voterStartedCampaignList = CampaignStore.getVoterStartedCampaignXDicts();
    this.setState({
      voterStartedCampaignList,
    });
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    const voterStartedCampaignList = CampaignStore.getVoterStartedCampaignXDicts();
    this.setState({
      voterStartedCampaignList,
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
    const { campaignList, loadingMoreItems, numberOfCampaignsToDisplay, voterStartedCampaignList, voterSupportedCampaignList } = this.state;
    renderLog('SettingsCampaignList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SettingsCampaignList render');
    const { location: { pathname } } = window;
    let showSupportedCampaigns = false;
    if (startsWith('/profile/supported', pathname)) {
      showSupportedCampaigns = true;
    }

    let numberOfCampaignsDisplayed = 0;
    return (
      <Wrapper>
        {showSupportedCampaigns ? (
          <div>
            <div>
              {voterSupportedCampaignList.map((oneCampaign) => {
                // console.log('oneCampaign:', oneCampaign);
                // console.log('numberOfCampaignsDisplayed:', numberOfCampaignsDisplayed);
                if (numberOfCampaignsDisplayed >= numberOfCampaignsToDisplay) {
                  return null;
                }
                numberOfCampaignsDisplayed += 1;
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
              {!!(campaignList && campaignList.length > 1) && (
                <LoadMoreItemsManually
                  loadingMoreItemsNow={loadingMoreItems}
                  numberOfItemsDisplayed={numberOfCampaignsDisplayed}
                  numberOfItemsTotal={campaignList.length}
                />
              )}
            </LoadMoreItemsManuallyWrapper>
          </div>
        ) : (
          <div>
            {voterStartedCampaignList.map((oneCampaign) => {
              // console.log('oneCampaign:', oneCampaign);
              return (
                <div key={`oneCampaignItemStarted-${oneCampaign.campaignx_we_vote_id}`}>
                  <CampaignCardForList
                    campaignXWeVoteId={oneCampaign.campaignx_we_vote_id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Wrapper>
    );
  }
}
SettingsCampaignList.propTypes = {
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

export default withStyles(styles)(SettingsCampaignList);
