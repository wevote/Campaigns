import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CampaignSupportActions from '../../actions/CampaignSupportActions';
import CampaignSupportStore from '../../stores/CampaignSupportStore';
import { renderLog } from '../../utils/logging';

class CampaignEndorsementInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      supportEndorsement: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateSupportEndorsement = this.updateSupportEndorsement.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignEndorsementInputField, componentDidMount');
    this.campaignSupportStoreListener = CampaignSupportStore.addListener(this.onCampaignSupportStoreChange.bind(this));
    const supportEndorsement = CampaignSupportStore.getSupportEndorsement();
    this.setState({
      supportEndorsement,
    });
  }

  componentWillUnmount () {
    this.campaignSupportStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onCampaignSupportStoreChange () {
    const supportEndorsement = CampaignSupportStore.getSupportEndorsement();
    const supportEndorsementQueuedToSave = CampaignSupportStore.getSupportEndorsementQueuedToSave();
    const supportEndorsementQueuedToSaveSet = CampaignSupportStore.getSupportEndorsementQueuedToSaveSet();
    let supportEndorsementAdjusted = supportEndorsement;
    if (supportEndorsementQueuedToSaveSet) {
      supportEndorsementAdjusted = supportEndorsementQueuedToSave;
    }
    // console.log('onCampaignSupportStoreChange supportEndorsement: ', supportEndorsement, ', supportEndorsementQueuedToSave: ', supportEndorsementQueuedToSave, ', supportEndorsementAdjusted:', supportEndorsementAdjusted);
    this.setState({
      supportEndorsement: supportEndorsementAdjusted,
    });
  }

  updateSupportEndorsement (event) {
    if (event.target.name === 'supportEndorsement') {
      CampaignSupportActions.supportEndorsementQueuedToSave(event.target.value);
      this.setState({
        supportEndorsement: event.target.value,
      });
    }
  }

  render () {
    renderLog('CampaignEndorsementInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { supportEndorsement } = this.state;
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
                  id={`supportEndorsementTextArea-${externalUniqueId}`}
                  name="supportEndorsement"
                  margin="dense"
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder={placeholderText}
                  value={supportEndorsement}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateSupportEndorsement}
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
  padding: 8px 12px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(CampaignEndorsementInputField);
