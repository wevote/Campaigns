import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AddCandidateInputField from '../../components/CampaignStart/AddPoliticianInputField';
import CampaignDescriptionInputField from '../../components/CampaignStart/CampaignDescriptionInputField';
import CampaignPhotoUpload from '../../components/CampaignStart/CampaignPhotoUpload';
import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartStore from '../../stores/CampaignStartStore';
import CampaignTitleInputField from '../../components/CampaignStart/CampaignTitleInputField';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import MainFooter from '../../components/Navigation/MainFooter';
import MainHeaderBar from '../../components/Navigation/MainHeaderBar';
import { renderLog } from '../../utils/logging';


class CampaignStartEditAll extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CampaignStartEditAll, componentDidMount');
    import('jquery').then(({ default: jquery }) => {
      window.jQuery = jquery;
      window.$ = jquery;
      CampaignStartActions.campaignRetrieveAsOwner('');
    }).catch((error) => console.error('An error occurred while loading jQuery', error));
  }

  cancelEditAll = () => {
    historyPush('/start-a-campaign-preview');
  }

  submitCampaignEditAll = () => {
    const campaignDescriptionQueuedToSave = CampaignStartStore.getCampaignDescriptionQueuedToSave();
    const campaignDescriptionQueuedToSaveSet = CampaignStartStore.getCampaignDescriptionQueuedToSaveSet();
    const campaignPhotoQueuedToSave = CampaignStartStore.getCampaignPhotoQueuedToSave();
    const campaignPhotoQueuedToSaveSet = CampaignStartStore.getCampaignPhotoQueuedToSaveSet();
    const campaignPoliticianListQueuedToSave = CampaignStartStore.getCampaignPoliticianListQueuedToSave();
    const campaignPoliticianListQueuedToSaveSet = CampaignStartStore.getCampaignPoliticianListQueuedToSaveSet();
    const campaignTitleQueuedToSave = CampaignStartStore.getCampaignTitleQueuedToSave();
    const campaignTitleQueuedToSaveSet = CampaignStartStore.getCampaignTitleQueuedToSaveSet();
    // console.log('CampaignStartEditAll campaignPoliticianListQueuedToSaveSet:', campaignPoliticianListQueuedToSaveSet);
    const campaignWeVoteId = '';
    if (campaignDescriptionQueuedToSaveSet || campaignPhotoQueuedToSaveSet || campaignPoliticianListQueuedToSaveSet || campaignTitleQueuedToSaveSet) {
      const campaignPoliticianListQueuedToSaveJson = JSON.stringify(campaignPoliticianListQueuedToSave);
      CampaignStartActions.campaignEditAllSave(
        campaignWeVoteId,
        campaignDescriptionQueuedToSave, campaignDescriptionQueuedToSaveSet,
        campaignPhotoQueuedToSave, campaignPhotoQueuedToSaveSet,
        campaignPoliticianListQueuedToSaveJson, campaignPoliticianListQueuedToSaveSet,
        campaignTitleQueuedToSave, campaignTitleQueuedToSaveSet,
      );
      CampaignStartActions.campaignEditAllReset();
    }
    historyPush('/start-a-campaign-preview');
  }

  render () {
    renderLog('CampaignStartEditAll');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignStartEditAll window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    return (
      <div>
        <Helmet title="Edit Your Campaign - We Vote Campaigns" />
        <MainHeaderBar />
        <SaveCancelOuterWrapper>
          <SaveCancelInnerWrapper>
            <SaveCancelButtonsWrapper>
              <Button
                classes={{ root: classes.buttonCancel }}
                color="primary"
                id="cancelEditAll"
                onClick={this.cancelEditAll}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                classes={{ root: classes.buttonSave }}
                color="primary"
                id="saveCampaignEditAll"
                onClick={this.submitCampaignEditAll}
                variant="contained"
              >
                Save
              </Button>
            </SaveCancelButtonsWrapper>
          </SaveCancelInnerWrapper>
        </SaveCancelOuterWrapper>
        <PageWrapper cordova={isCordova()}>
          <OuterWrapper>
            <InnerWrapper>
              <CampaignStartSectionWrapper>
                <CampaignStartSection>
                  <AddCandidateInputField />
                  <CampaignTitleInputField campaignTitlePlaceholder="Title of your campaign" />
                  <CampaignPhotoUpload />
                  <CampaignDescriptionInputField />
                </CampaignStartSection>
              </CampaignStartSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <MainFooter />
      </div>
    );
  }
}
CampaignStartEditAll.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonCancel: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 30px',
    textTransform: 'none',
    width: 100,
  },
  buttonSave: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    marginLeft: 10,
    padding: '0 30px',
    textTransform: 'none',
    width: 150,
  },
  buttonRoot: {
    width: 250,
  },
});

const CampaignStartSection = styled.div`
  margin-bottom: 60px !important;
  max-width: 620px;
  width: 100%;
`;

const CampaignStartSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SaveCancelButtonsWrapper = styled.div`
  display: flex;
`;

const SaveCancelInnerWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
  max-width: 960px;
  padding: 8px 0;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const SaveCancelOuterWrapper = styled.div`
  background-color: #f6f4f6;
  border-bottom: 1px solid #ddd;
  // margin: 10px 0;
  width: 100%;
`;

const InnerWrapper = styled.div`
  width: 100%;
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

export default withStyles(styles)(CampaignStartEditAll);
