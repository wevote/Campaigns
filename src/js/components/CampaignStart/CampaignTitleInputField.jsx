import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartStore from '../../stores/CampaignStartStore';
import { renderLog } from '../../utils/logging';

class CampaignTitleInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignTitle: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateCampaignTitle = this.updateCampaignTitle.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignTitleInputField, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    const campaignTitle = CampaignStartStore.getCampaignTitle();
    this.setState({
      campaignTitle,
    });
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onCampaignStartStoreChange () {
    const campaignTitle = CampaignStartStore.getCampaignTitle();
    const campaignTitleQueuedToSave = CampaignStartStore.getCampaignTitleQueuedToSave();
    const campaignTitleAdjusted = campaignTitleQueuedToSave || campaignTitle;
    // console.log('onCampaignStartStoreChange campaignTitle: ', campaignTitle, ', campaignTitleQueuedToSave: ', campaignTitleQueuedToSave, ', campaignTitleAdjusted:', campaignTitleAdjusted);
    this.setState({
      campaignTitle: campaignTitleAdjusted,
    });
  }

  updateCampaignTitle (event) {
    if (event.target.name === 'campaignTitle') {
      CampaignStartActions.campaignTitleQueuedToSave(event.target.value);
      this.setState({
        campaignTitle: event.target.value,
      });
    }
  }

  render () {
    renderLog('CampaignTitleInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { campaignTitle } = this.state;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  id={`campaignTitleTextArea-${externalUniqueId}`}
                  name="campaignTitle"
                  margin="dense"
                  variant="outlined"
                  placeholder="What will the candidate(s) accomplish?"
                  value={campaignTitle}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateCampaignTitle}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
CampaignTitleInputField.propTypes = {
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

export default withStyles(styles)(CampaignTitleInputField);
