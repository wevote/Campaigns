import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CampaignActions from '../../actions/CampaignActions';
import { renderLog } from '../../common/utils/logging';
import startsWith from '../../common/utils/startsWith';
import CampaignStore from '../../stores/CampaignStore';
import initializejQuery from '../../utils/initializejQuery';
import CampaignCardForList from '../Campaign/CampaignCardForList';
import LoadMoreItemsManually from '../Widgets/LoadMoreItemsManually';


const STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY = 6;
const NUMBER_OF_CAMPAIGNS_TO_ADD_WHEN_MORE_CLICKED = 6;

class SettingsCampaignList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      numberOfCampaignsToDisplay: STARTING_NUMBER_OF_CAMPAIGNS_TO_DISPLAY,
      voterOwnedCampaignList: [],
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
    const voterOwnedCampaignList = CampaignStore.getVoterOwnedCampaignXDicts();
    const voterSupportedCampaignList = CampaignStore.getVoterSupportedCampaignXDicts();
    this.setState({
      voterOwnedCampaignList,
      voterSupportedCampaignList,
    });
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
  }

  onCampaignStoreChange () {
    // Your campaigns tab
    const voterOwnedCampaignListUnsorted = CampaignStore.getVoterOwnedCampaignXDicts();
    const voterOwnedCampaignListSortedBySupporters = voterOwnedCampaignListUnsorted.sort(this.orderBySupportersCount);
    const voterOwnedCampaignList = voterOwnedCampaignListSortedBySupporters.sort(this.orderByElectionInPast);
    // Your supported campaigns tab
    const voterSupportedCampaignListUnsorted = CampaignStore.getVoterSupportedCampaignXDicts();
    const voterSupportedCampaignListSortedBySupporters = voterSupportedCampaignListUnsorted.sort(this.orderBySupportersCount);
    const voterSupportedCampaignList = voterSupportedCampaignListSortedBySupporters.sort(this.orderByElectionInPast);
    this.setState({
      voterOwnedCampaignList,
      voterSupportedCampaignList,
    });
  }

  orderByElectionInPast = (firstCampaign, secondCampaign) => {
    // The goal is to have elections in the past be pushed to the bottom of the list
    const firstCampaignElectionDateInPast = firstCampaign.final_election_date_in_past ? 1 : 0;
    const secondCampaignElectionDateInPast = secondCampaign.final_election_date_in_past ? 1 : 0;
    return firstCampaignElectionDateInPast - secondCampaignElectionDateInPast;
  }

  orderBySupportersCount = (firstCampaign, secondCampaign) => secondCampaign.supporters_count - firstCampaign.supporters_count;

  increaseNumberOfCampaignsToDisplay = () => {
    let { numberOfCampaignsToDisplay } = this.state;
    numberOfCampaignsToDisplay += NUMBER_OF_CAMPAIGNS_TO_ADD_WHEN_MORE_CLICKED;
    this.setState({
      numberOfCampaignsToDisplay,
    });
  }

  render () {
    renderLog('SettingsCampaignList');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SettingsCampaignList render');
    const { numberOfCampaignsToDisplay, voterOwnedCampaignList, voterSupportedCampaignList } = this.state;
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
              {!!(voterSupportedCampaignList &&
                voterSupportedCampaignList.length > 1 &&
                numberOfCampaignsToDisplay < voterSupportedCampaignList.length) && (
                <LoadMoreItemsManually
                  loadMoreFunction={this.increaseNumberOfCampaignsToDisplay}
                  uniqueExternalId="SettingsCampaignList"
                />
              )}
            </LoadMoreItemsManuallyWrapper>
          </div>
        ) : (
          <div>
            {voterOwnedCampaignList.map((oneCampaign) => (
              <div key={`oneCampaignItemStarted-${oneCampaign.campaignx_we_vote_id}`}>
                <CampaignCardForList
                  campaignXWeVoteId={oneCampaign.campaignx_we_vote_id}
                />
              </div>
            ))}
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

const LoadMoreItemsManuallyWrapper = styled('div')(({ theme }) => (`
  margin-bottom: 0;
  padding-left: 16px;
  padding-right: 26px;
  ${theme.breakpoints.down('sm')} {
    padding-right: 16px;
  }
  @media print{
    display: none;
  }
`));

const Wrapper = styled('div')`
`;

export default withStyles(styles)(SettingsCampaignList);
