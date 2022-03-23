import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CampaignStartActions from '../../actions/CampaignStartActions';
import { renderLog } from '../../common/utils/logging';

class DeletePoliticianCheckbox extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateDeleteState = this.updateDeleteState.bind(this);
  }

  handleKeyPress () {
    //
  }

  updateDeleteState (event) {
    if (event.target.name === 'deletePoliticianCheckbox') {
      const { campaignXPoliticianId } = this.props;
      const deleteStateChecked = Boolean(event.target.checked);
      if (deleteStateChecked) {
        CampaignStartActions.campaignPoliticianDeleteAddQueuedToSave(campaignXPoliticianId);
      } else {
        CampaignStartActions.campaignPoliticianDeleteRemoveQueuedToSave(campaignXPoliticianId);
      }
    }
  }

  render () {
    renderLog('DeletePoliticianCheckbox');  // Set LOG_RENDER_EVENTS to log all renders

    const { campaignXPoliticianId, classes, externalUniqueId } = this.props;
    return (
      <div key={`deletePolitician-${campaignXPoliticianId}`}>
        {!!(campaignXPoliticianId) && (
          <form onSubmit={(e) => { e.preventDefault(); }}>
            <Wrapper>
              <ColumnFullWidth>
                <FormControl classes={{ root: classes.formControl }}>
                  <CheckboxLabel
                    classes={{ label: classes.checkboxLabel }}
                    control={(
                      <Checkbox
                        classes={{ root: classes.checkboxRoot }}
                        color="primary"
                        id={`deletePoliticianCheckbox-${campaignXPoliticianId}-${externalUniqueId}`}
                        name="deletePoliticianCheckbox"
                        onChange={this.updateDeleteState}
                        onKeyDown={this.handleKeyPress}
                      />
                    )}
                    label="remove"
                  />
                </FormControl>
              </ColumnFullWidth>
            </Wrapper>
          </form>
        )}
      </div>
    );
  }
}
DeletePoliticianCheckbox.propTypes = {
  campaignXPoliticianId: PropTypes.number,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
  checkboxRoot: {
    paddingTop: 0,
    paddingLeft: 9,
    paddingBottom: 0,
    paddingRight: 4,
  },
  checkboxLabel: {
    fontSize: 16,
    marginTop: 2,
  },
});

const CheckboxLabel = styled(FormControlLabel)`
  margin-right: 5px;
  flex-direction: row-reverse;
  margin-bottom: 0 !important;
`;

const ColumnFullWidth = styled('div')`
  padding: 0 12px;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(DeletePoliticianCheckbox);
