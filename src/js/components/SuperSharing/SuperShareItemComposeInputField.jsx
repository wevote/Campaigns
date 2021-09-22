import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField, FormControl } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CampaignStore from '../../stores/CampaignStore';
import { renderLog } from '../../utils/logging';
import politicianListToSentenceString from '../../utils/politicianListToSentenceString';
import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';

class SuperShareItemComposeInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignXPoliticianList: [],
      personalizedMessage: '',
      personalizedSubject: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updatePersonalizedSubject = this.updatePersonalizedSubject.bind(this);
    this.updatePersonalizedMessage = this.updatePersonalizedMessage.bind(this);
  }

  componentDidMount () {
    // console.log('SuperShareItemComposeInputField, componentDidMount');
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onShareStoreChange();
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
      if (!superShareItemId || superShareItemId === 0) {
        this.onShareStoreChange();
      }
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
        this.onShareStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStoreListener.remove();
    this.shareStoreListener.remove();
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

  onShareStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
    if (superShareItemId) {
      const superShareItem = ShareStore.getSuperShareItemById(superShareItemId);
      const {
        personalized_message: personalizedMessage,
        personalized_subject: personalizedSubject,
      } = superShareItem;
      const personalizedMessageQueuedToSave = ShareStore.getPersonalizedMessageQueuedToSave(superShareItemId);
      const personalizedMessageQueuedToSaveSet = ShareStore.getPersonalizedMessageQueuedToSaveSet(superShareItemId);
      let personalizedMessageAdjusted = personalizedMessage;
      if (personalizedMessageQueuedToSaveSet) {
        personalizedMessageAdjusted = personalizedMessageQueuedToSave;
      }
      const personalizedSubjectQueuedToSave = ShareStore.getPersonalizedSubjectQueuedToSave(superShareItemId);
      const personalizedSubjectQueuedToSaveSet = ShareStore.getPersonalizedSubjectQueuedToSaveSet(superShareItemId);
      let personalizedSubjectAdjusted = personalizedSubject;
      if (personalizedSubjectQueuedToSaveSet) {
        personalizedSubjectAdjusted = personalizedSubjectQueuedToSave;
      }
      // console.log('onShareStoreChange personalizedSubject: ', personalizedSubject, ', personalizedSubjectAdjusted: ', personalizedSubjectAdjusted);
      // console.log('onShareStoreChange personalizedMessage: ', personalizedMessage, ', personalizedMessageAdjusted: ', personalizedMessageAdjusted);
      this.setState({
        personalizedMessage: personalizedMessageAdjusted,
        personalizedSubject: personalizedSubjectAdjusted,
      });
    }
  }

  updatePersonalizedSubject (event) {
    if (event.target.name === 'personalizedSubject') {
      const { campaignXWeVoteId } = this.props;
      const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
      ShareActions.personalizedSubjectQueuedToSave(superShareItemId, event.target.value);
      this.setState({
        personalizedSubject: event.target.value,
      });
    }
  }

  updatePersonalizedMessage (event) {
    if (event.target.name === 'personalizedMessage') {
      const { campaignXWeVoteId } = this.props;
      const superShareItemId = ShareStore.getSuperSharedItemDraftIdByWeVoteId(campaignXWeVoteId);
      ShareActions.personalizedMessageQueuedToSave(superShareItemId, event.target.value);
      this.setState({
        personalizedMessage: event.target.value,
      });
    }
  }

  render () {
    renderLog('SuperShareItemComposeInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { campaignXPoliticianList, personalizedSubject, personalizedMessage } = this.state;
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
                  id={`PersonalizedSubjectTextArea-${externalUniqueId}`}
                  label="Subject"
                  name="personalizedSubject"
                  margin="dense"
                  multiline
                  rows={1}
                  variant="outlined"
                  placeholder={placeholderSubject}
                  value={personalizedSubject || ''}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updatePersonalizedSubject}
                />
              </FormControl>
            </ColumnFullWidth>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`PersonalizedMessageTextArea-${externalUniqueId}`}
                  name="personalizedMessage"
                  margin="dense"
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder={placeholderText}
                  value={personalizedMessage || ''}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updatePersonalizedMessage}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
SuperShareItemComposeInputField.propTypes = {
  // campaignXNewsItemWeVoteId: PropTypes.string,
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
  flex-direction: column;
  margin-left: -12px;
  width: 100%;
`;

export default withStyles(styles)(SuperShareItemComposeInputField);
