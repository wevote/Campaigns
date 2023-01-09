import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CampaignNewsItemActions from '../../actions/CampaignNewsItemActions';
import { renderLog } from '../../common/utils/logging';
import politicianListToSentenceString from '../../common/utils/politicianListToSentenceString';
import CampaignNewsItemStore from '../../common/stores/CampaignNewsItemStore';
import CampaignStore from '../../common/stores/CampaignStore';

class CampaignNewsItemTextInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXPoliticianList: [],
      campaignNewsSubject: '',
      campaignNewsText: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateCampaignNewsItemSubject = this.updateCampaignNewsItemSubject.bind(this);
    this.updateCampaignNewsItemText = this.updateCampaignNewsItemText.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignNewsItemTextInputField, componentDidMount');
    this.onCampaignStoreChange();
    this.onCampaignNewsItemStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignNewsItemStoreListener = CampaignNewsItemStore.addListener(this.onCampaignNewsItemStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignNewsItemTextInputField componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
        this.onCampaignNewsItemStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
    this.campaignNewsItemStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignXPoliticianList = CampaignStore.getCampaignXPoliticianList(campaignXWeVoteId);
    this.setState({
      campaignXPoliticianList,
    });
  }

  onCampaignNewsItemStoreChange () {
    const { campaignXNewsItemWeVoteId, campaignXWeVoteId } = this.props;
    let campaignNewsSubject = '';
    let campaignNewsText = '';
    if (campaignXWeVoteId) {
      const campaignXNewsItem = CampaignStore.getCampaignXNewsItemByWeVoteId(campaignXNewsItemWeVoteId);
      // console.log('campaignXSupporter:', campaignXSupporter);
      ({
        campaign_news_subject: campaignNewsSubject,
        campaign_news_text: campaignNewsText,
      } = campaignXNewsItem);
    }
    const campaignNewsItemSubjectQueuedToSave = CampaignNewsItemStore.getCampaignNewsItemSubjectQueuedToSave();
    const campaignNewsItemSubjectQueuedToSaveSet = CampaignNewsItemStore.getCampaignNewsItemSubjectQueuedToSaveSet();
    let campaignNewsSubjectAdjusted = campaignNewsSubject;
    if (campaignNewsItemSubjectQueuedToSaveSet) {
      campaignNewsSubjectAdjusted = campaignNewsItemSubjectQueuedToSave;
    }
    const campaignNewsItemTextQueuedToSave = CampaignNewsItemStore.getCampaignNewsItemTextQueuedToSave();
    const campaignNewsItemTextQueuedToSaveSet = CampaignNewsItemStore.getCampaignNewsItemTextQueuedToSaveSet();
    let campaignNewsTextAdjusted = campaignNewsText;
    if (campaignNewsItemTextQueuedToSaveSet) {
      campaignNewsTextAdjusted = campaignNewsItemTextQueuedToSave;
    }
    // console.log('onCampaignNewsItemStoreChange campaignNewsText: ', campaignNewsText, ', campaignNewsItemTextQueuedToSave: ', campaignNewsItemTextQueuedToSave, ', campaignNewsTextAdjusted:', campaignNewsTextAdjusted);
    this.setState({
      campaignNewsSubject: campaignNewsSubjectAdjusted,
      campaignNewsText: campaignNewsTextAdjusted,
    });
  }

  updateCampaignNewsItemSubject (event) {
    if (event.target.name === 'campaignNewsSubject') {
      CampaignNewsItemActions.campaignNewsItemSubjectQueuedToSave(event.target.value);
      this.setState({
        campaignNewsSubject: event.target.value,
      });
    }
  }

  updateCampaignNewsItemText (event) {
    if (event.target.name === 'campaignNewsText') {
      CampaignNewsItemActions.campaignNewsItemTextQueuedToSave(event.target.value);
      this.setState({
        campaignNewsText: event.target.value,
      });
    }
  }

  render () {
    renderLog('CampaignNewsItemTextInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { campaignXPoliticianList, campaignNewsSubject, campaignNewsText } = this.state;
    let numberOfPoliticians = 0;
    if (campaignXPoliticianList && campaignXPoliticianList.length > 0) {
      numberOfPoliticians = campaignXPoliticianList.length;
    }
    let placeholderSubject = '';
    let placeholderText = '';
    if (numberOfPoliticians > 0) {
      const politicianListSentenceString = politicianListToSentenceString(campaignXPoliticianList);
      placeholderSubject += `Update about${politicianListSentenceString}`;
      placeholderText += `Thank you for supporting${politicianListSentenceString}.`;
      placeholderText += ' I wanted to share some news that...';
    } else {
      placeholderSubject += 'Campaign update';
      placeholderText += 'Thank you for supporting this campaign! I wanted to share some news that...';
    }
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`campaignNewsItemSubjectTextArea-${externalUniqueId}`}
                  label="Subject"
                  name="campaignNewsSubject"
                  margin="dense"
                  multiline
                  rows={1}
                  variant="outlined"
                  placeholder={placeholderSubject}
                  value={campaignNewsSubject || ''}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateCampaignNewsItemSubject}
                />
              </FormControl>
            </ColumnFullWidth>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`campaignNewsItemTextTextArea-${externalUniqueId}`}
                  name="campaignNewsText"
                  margin="dense"
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder={placeholderText}
                  value={campaignNewsText || ''}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateCampaignNewsItemText}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
CampaignNewsItemTextInputField.propTypes = {
  campaignXNewsItemWeVoteId: PropTypes.string,
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

const ColumnFullWidth = styled('div')`
  padding: 8px 12px 0 12px;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  margin-left: -12px;
  width: 100%;
`;

export default withStyles(styles)(CampaignNewsItemTextInputField);
