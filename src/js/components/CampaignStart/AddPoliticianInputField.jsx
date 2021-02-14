import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartStore from '../../stores/CampaignStartStore';
import { renderLog } from '../../utils/logging';
import SearchAllActions from '../../actions/SearchAllActions';
import SearchAllStore from '../../stores/SearchAllStore';

const candidateOptionsDefault = [
  // { value: 'abraham', label: 'Abraham Lincoln' },
  // { value: 'test',
  //   label: (
  //     <span>
  //       <strong>THE </strong>
  //       TEST
  //     </span>
  //   ),
  // },
  // { value: 'george', label: 'George Washington' },
];

// See: https://react-select.com/creatable and https://www.npmjs.com/package/react-select
class AddPoliticianInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // campaignPoliticianList: [],
      // searchResults: [],
      campaignPoliticianListUpdatedSet: false,
    };
  }

  componentDidMount () {
    // console.log('AddPoliticianInputField, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.searchAllStoreListener = SearchAllStore.addListener(this.onSearchAllStoreChange.bind(this));
    SearchAllActions.clearSearchResults();
    const campaignPoliticianList = CampaignStartStore.getCampaignPoliticianList();
    this.setState({
      candidateOptions: candidateOptionsDefault,
      campaignPoliticianList,
    });
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
    this.searchAllStoreListener.remove();
  }

  onCampaignStartStoreChange () {
    const campaignPoliticianList = CampaignStartStore.getCampaignPoliticianList();
    // const { campaignPoliticianListUpdatedSet } = this.state;
    // console.log('onCampaignStartStoreChange campaignPoliticianListUpdatedSet: ', campaignPoliticianListUpdatedSet, ', campaignPoliticianList: ', campaignPoliticianList);
    this.setState({
      campaignPoliticianList,
    });
  }

  onSearchAllStoreChange () {
    const searchResults = SearchAllStore.getSearchResults();
    // console.log('onSearchAllStoreChange searchResults: ', searchResults);
    const candidateOptions = [];
    // let oneOptionHtml;
    let oneSearchResult;
    let oneCandidateOption;
    for (let i = 0; i < searchResults.length; ++i) {
      oneSearchResult = searchResults[i];
      // console.log('onSearchAllStoreChange oneSearchResult: ', oneSearchResult);
      if (oneSearchResult.we_vote_id) {
        oneCandidateOption = { value: oneSearchResult.we_vote_id, label: oneSearchResult.result_title };
        // console.log('onSearchAllStoreChange oneCandidateOption: ', oneCandidateOption);
        candidateOptions.push(oneCandidateOption);
      }
    }
    this.setState({
      candidateOptions,
    });
  }

  searchTermHasChanged = (event) => {
    const minimumSearchTermLength = 1;
    // console.log('searchTermHasChanged:', event.target.value);
    if (event.target.value && event.target.value.length > minimumSearchTermLength) {
      // Add delay so it only searches after 750 ms pause
      const searchScopeList = ['PN']; // Politician Name
      SearchAllActions.searchAll(event.target.value, searchScopeList);
    }
  }

  handleChange = (newValue) => { // , actionMeta
    // console.group('Value Changed');
    // console.log(newValue);
    // // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
    CampaignStartActions.campaignPoliticianListQueuedToSave(newValue);
    this.setState({
      campaignPoliticianListUpdated: newValue,
      campaignPoliticianListUpdatedSet: true,
    });
  };

  render () {
    renderLog('AddPoliticianInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { externalUniqueId } = this.props;
    const {
      campaignPoliticianList, campaignPoliticianListUpdated,
      campaignPoliticianListUpdatedSet, candidateOptions,
    } = this.state;
    // console.log('render campaignPoliticianListUpdatedSet: ', campaignPoliticianListUpdatedSet, ', campaignPoliticianList:', campaignPoliticianList, ', campaignPoliticianListUpdated: ', campaignPoliticianListUpdated);
    // console.log('candidateOptions:', candidateOptions);
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <CreatableSelect
                defaultValue={campaignPoliticianList}
                // isClearable
                id={`addCandidateInputField-${externalUniqueId}`}
                isMulti
                // name="addCandidateInputField" // Doesn't seem to be supported
                onChange={this.handleChange}
                // onCreateOption={this.handleCreate}
                onKeyDown={this.searchTermHasChanged}
                options={candidateOptions}
                placeholder="Name of candidate(s)?"
                value={campaignPoliticianListUpdatedSet ? campaignPoliticianListUpdated : campaignPoliticianList}
              />
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
AddPoliticianInputField.propTypes = {
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
});

const ColumnFullWidth = styled.div`
  padding: 8px 12px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(AddPoliticianInputField);
