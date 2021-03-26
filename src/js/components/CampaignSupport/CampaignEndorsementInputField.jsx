import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CampaignSupporterActions from '../../actions/CampaignSupporterActions';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import { renderLog } from '../../utils/logging';

class CampaignEndorsementInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      supporterEndorsement: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateSupporterEndorsement = this.updateSupporterEndorsement.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignEndorsementInputField, componentDidMount');
    this.onCampaignSupporterStoreChange();
    this.campaignSupporterStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignEndorsementInputField componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignSupporterStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignSupporterStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onCampaignSupporterStoreChange () {
    const { campaignXWeVoteId } = this.props;
    let supporterEndorsement = '';
    if (campaignXWeVoteId) {
      const campaignXSupporter = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('campaignXSupporter:', campaignXSupporter);
      ({ supporter_endorsement: supporterEndorsement } = campaignXSupporter);
    }
    const supporterEndorsementQueuedToSave = CampaignSupporterStore.getSupporterEndorsementQueuedToSave();
    const supporterEndorsementQueuedToSaveSet = CampaignSupporterStore.getSupporterEndorsementQueuedToSaveSet();
    let supporterEndorsementAdjusted = supporterEndorsement;
    if (supporterEndorsementQueuedToSaveSet) {
      supporterEndorsementAdjusted = supporterEndorsementQueuedToSave;
    }
    // console.log('onCampaignSupporterStoreChange supporterEndorsement: ', supporterEndorsement, ', supporterEndorsementQueuedToSave: ', supporterEndorsementQueuedToSave, ', supporterEndorsementAdjusted:', supporterEndorsementAdjusted);
    this.setState({
      supporterEndorsement: supporterEndorsementAdjusted,
    });
  }

  updateSupporterEndorsement (event) {
    if (event.target.name === 'supporterEndorsement') {
      CampaignSupporterActions.supporterEndorsementQueuedToSave(event.target.value);
      this.setState({
        supporterEndorsement: event.target.value,
      });
    }
  }

  render () {
    renderLog('CampaignEndorsementInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { supporterEndorsement } = this.state;
    const candidateNameString = 'Candidate One';
    const moreThanOneCandidate = false;
    let placeholderText = `I am supporting ${candidateNameString}.`;
    if (moreThanOneCandidate) {
      placeholderText += ' It is important they win because...';
    } else {
      placeholderText += ' It is important for them to win because...';
    }
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`supporterEndorsementTextArea-${externalUniqueId}`}
                  name="supporterEndorsement"
                  margin="dense"
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder={placeholderText}
                  value={supporterEndorsement || ''}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateSupporterEndorsement}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
CampaignEndorsementInputField.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
  // TODO: Figure out how to apply to TextField
  textField: {
    fontSize: '22px',
  },
});

const ColumnFullWidth = styled.div`
  padding: 8px 12px 0 12px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(CampaignEndorsementInputField);
