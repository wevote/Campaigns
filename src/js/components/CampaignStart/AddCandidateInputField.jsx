import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
// import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartStore from '../../stores/CampaignStartStore';
import { renderLog } from '../../utils/logging';
import SearchAllActions from '../../actions/SearchAllActions';
import SearchAllStore from '../../stores/SearchAllStore';

const candidateOptions = [
  { value: 'abraham', label: 'Abraham Lincoln' },
  { value: 'test',
    label: (
      <span>
        <strong>THE </strong>
        TEST
      </span>
    ),
  },
  { value: 'george', label: 'George Washington' },
];

class AddCandidateInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // campaignCandidateList: [],
      // searchResults: [],
      // textFromSearchField: '',
    };
  }

  componentDidMount () {
    // console.log('AddCandidateInputField, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.searchAllStoreListener = SearchAllStore.addListener(this.onSearchAllStoreChange.bind(this));
    SearchAllActions.clearSearchResults();
    const campaignCandidateList = CampaignStartStore.getCampaignCandidateList();
    this.setState({
      campaignCandidateList, // eslint-disable-line react/no-unused-state
    });
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
    this.searchAllStoreListener.remove();
  }

  onCampaignStartStoreChange () {
    const campaignCandidateList = CampaignStartStore.getCampaignCandidateList();
    const campaignCandidateListQueuedToSave = CampaignStartStore.getCampaignCandidateListQueuedToSave();
    const campaignCandidateListAdjusted = campaignCandidateListQueuedToSave || campaignCandidateList;
    // console.log('onCampaignStartStoreChange campaignCandidateList: ', campaignCandidateList, ', campaignCandidateListQueuedToSave: ', campaignCandidateListQueuedToSave, ', campaignCandidateListAdjusted:', campaignCandidateListAdjusted);
    this.setState({
      campaignCandidateList: campaignCandidateListAdjusted, // eslint-disable-line react/no-unused-state
    });
  }

  onSearchAllStoreChange () {
    // const campaignTitle = CampaignStartStore.getCampaignTitle();
    // const campaignTitleQueuedToSave = CampaignStartStore.getCampaignTitleQueuedToSave();
    // const campaignTitleAdjusted = campaignTitleQueuedToSave || campaignTitle;
    // console.log('onCampaignStartStoreChange campaignTitle: ', campaignTitle, ', campaignTitleQueuedToSave: ', campaignTitleQueuedToSave, ', campaignTitleAdjusted:', campaignTitleAdjusted);
    // this.setState({
    //   campaignTitle: campaignTitleAdjusted,
    // });
  }

  searchTermHasChanged = (event) => {
    const minimumSearchTermLength = 5;
    console.log('searchTermHasChanged:', event.target.value);
    if (event.target.value && event.target.value.length > minimumSearchTermLength) {
      // Add delay so it only searches after 750 ms pause
      SearchAllActions.searchAll(event.target.value, ['P']);
    }
  }

  handleChange = (newValue, actionMeta) => {
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  render () {
    renderLog('AddCandidateInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { externalUniqueId } = this.props;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <CreatableSelect
                id={`addCandidateInputField-${externalUniqueId}`}
                isMulti
                // name="addCandidateInputField" // Doesn't seem to be supported
                onChange={this.handleChange}
                onKeyDown={this.searchTermHasChanged}
                options={candidateOptions}
                placeholder="Name of candidate(s)?"
              />
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
AddCandidateInputField.propTypes = {
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

export default withStyles(styles)(AddCandidateInputField);
