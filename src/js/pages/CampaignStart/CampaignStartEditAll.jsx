import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AppStore from '../../stores/AppStore';
import AddCandidateInputField from '../../components/CampaignStart/AddPoliticianInputField';
import CampaignDescriptionInputField from '../../components/CampaignStart/CampaignDescriptionInputField';
import CampaignPhotoUpload from '../../components/CampaignStart/CampaignPhotoUpload';
import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartStore from '../../stores/CampaignStartStore';
import CampaignStore from '../../stores/CampaignStore';
import CampaignTitleInputField from '../../components/CampaignStart/CampaignTitleInputField';
import EditPoliticianList from '../../components/CampaignStart/EditPoliticianList';
import { getCampaignXValuesFromIdentifiers, retrieveCampaignXFromIdentifiersIfNeeded } from '../../utils/campaignUtils';
import { historyPush, isCordova } from '../../utils/cordovaUtils';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';

const CampaignRetrieveController = React.lazy(() => import('../../components/Campaign/CampaignRetrieveController'));


class CampaignStartEditAll extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSEOFriendlyPath: '',
      campaignXWeVoteId: '',
      chosenWebsiteName: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignStartEditAll, componentDidMount');
    const { editExistingCampaign } = this.props;
    if (this.props.setShowHeaderFooter) {
      this.props.setShowHeaderFooter(!editExistingCampaign);
    }
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    if (editExistingCampaign) {
      const { match: { params } } = this.props;
      const {
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      } = params;
      // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
      const {
        campaignSEOFriendlyPath,
        campaignXWeVoteId,
      } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
      if (campaignSEOFriendlyPath) {
        this.setState({
          campaignSEOFriendlyPath,
        });
      } else if (campaignSEOFriendlyPathFromParams) {
        this.setState({
          campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
        });
      }
      if (campaignXWeVoteId) {
        this.setState({
          campaignXWeVoteId,
        });
      } else if (campaignXWeVoteIdFromParams) {
        this.setState({
          campaignXWeVoteId: campaignXWeVoteIdFromParams,
        });
      }
      // Take the "calculated" identifiers and retrieve if missing
      retrieveCampaignXFromIdentifiersIfNeeded(campaignSEOFriendlyPath, campaignXWeVoteId);
    } else {
      initializejQuery(() => {
        CampaignStartActions.campaignRetrieveAsOwner('');
        CampaignStartActions.campaignEditAllReset();
      });
    }
  }

  componentWillUnmount () {
    if (this.props.setShowHeaderFooter) {
      this.props.setShowHeaderFooter(true);
    }
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onAppStoreChange () {
    const chosenWebsiteName = AppStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  onCampaignStoreChange () {
    const { editExistingCampaign } = this.props;
    // console.log('onCampaignStoreChange campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
    if (editExistingCampaign) {
      const { match: { params } } = this.props;
      const {
        campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
        campaignXWeVoteId: campaignXWeVoteIdFromParams,
      } = params;
      // console.log('componentDidMount campaignSEOFriendlyPathFromParams: ', campaignSEOFriendlyPathFromParams, ', campaignXWeVoteIdFromParams: ', campaignXWeVoteIdFromParams);
      const {
        campaignSEOFriendlyPath,
        campaignXWeVoteId,
      } = getCampaignXValuesFromIdentifiers(campaignSEOFriendlyPathFromParams, campaignXWeVoteIdFromParams);
      if (campaignSEOFriendlyPath) {
        this.setState({
          campaignSEOFriendlyPath,
        });
      } else if (campaignSEOFriendlyPathFromParams) {
        this.setState({
          campaignSEOFriendlyPath: campaignSEOFriendlyPathFromParams,
        });
      }
      if (campaignXWeVoteId) {
        this.setState({
          campaignXWeVoteId,
        });
      } else if (campaignXWeVoteIdFromParams) {
        this.setState({
          campaignXWeVoteId: campaignXWeVoteIdFromParams,
        });
      }
    }
  }

  cancelEditAll = () => {
    const { editExistingCampaign } = this.props;
    if (editExistingCampaign) {
      const { campaignXWeVoteId, campaignSEOFriendlyPath } = this.state;
      if (campaignSEOFriendlyPath) {
        historyPush(`/c/${campaignSEOFriendlyPath}`);
      } else {
        historyPush(`/id/${campaignXWeVoteId}`);
      }
    } else {
      historyPush('/start-a-campaign-preview');
    }
  }

  submitCampaignEditAll = () => {
    const { editExistingCampaign } = this.props;
    const { campaignXWeVoteId } = this.state;
    const campaignDescriptionQueuedToSave = CampaignStartStore.getCampaignDescriptionQueuedToSave();
    const campaignDescriptionQueuedToSaveSet = CampaignStartStore.getCampaignDescriptionQueuedToSaveSet();
    const campaignPhotoQueuedToSave = CampaignStartStore.getCampaignPhotoQueuedToSave();
    const campaignPhotoQueuedToSaveSet = CampaignStartStore.getCampaignPhotoQueuedToSaveSet();
    const campaignPoliticianDeleteList = CampaignStartStore.getCampaignPoliticianDeleteList();
    const campaignPoliticianStarterListQueuedToSave = CampaignStartStore.getCampaignPoliticianStarterListQueuedToSave();
    const campaignPoliticianStarterListQueuedToSaveSet = CampaignStartStore.getCampaignPoliticianStarterListQueuedToSaveSet();
    const campaignTitleQueuedToSave = CampaignStartStore.getCampaignTitleQueuedToSave();
    const campaignTitleQueuedToSaveSet = CampaignStartStore.getCampaignTitleQueuedToSaveSet();
    // console.log('CampaignStartEditAll campaignPoliticianStarterListQueuedToSaveSet:', campaignPoliticianStarterListQueuedToSaveSet);
    if (campaignDescriptionQueuedToSaveSet || campaignPhotoQueuedToSaveSet || campaignPoliticianDeleteList || campaignPoliticianStarterListQueuedToSaveSet || campaignTitleQueuedToSaveSet) {
      const campaignPoliticianDeleteListJson = JSON.stringify(campaignPoliticianDeleteList);
      const campaignPoliticianStarterListQueuedToSaveJson = JSON.stringify(campaignPoliticianStarterListQueuedToSave);
      // console.log('CampaignStartEditAll campaignPoliticianStarterListQueuedToSaveJson:', campaignPoliticianStarterListQueuedToSaveJson);
      CampaignStartActions.campaignEditAllSave(
        campaignXWeVoteId,
        campaignDescriptionQueuedToSave, campaignDescriptionQueuedToSaveSet,
        campaignPhotoQueuedToSave, campaignPhotoQueuedToSaveSet, campaignPoliticianDeleteListJson,
        campaignPoliticianStarterListQueuedToSaveJson, campaignPoliticianStarterListQueuedToSaveSet,
        campaignTitleQueuedToSave, campaignTitleQueuedToSaveSet,
      );
      CampaignStartActions.campaignEditAllReset();
    }
    if (editExistingCampaign) {
      const { campaignSEOFriendlyPath } = this.state;
      if (campaignSEOFriendlyPath) {
        historyPush(`/c/${campaignSEOFriendlyPath}`);
      } else {
        historyPush(`/id/${campaignXWeVoteId}`);
      }
    } else {
      historyPush('/start-a-campaign-preview');
    }
  }

  render () {
    renderLog('CampaignStartEditAll');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignStartEditAll window.location.href: ${window.location.href}`);
    }
    const { classes, editExistingCampaign } = this.props;
    const { campaignSEOFriendlyPath, campaignXWeVoteId, chosenWebsiteName } = this.state;
    return (
      <div>
        <Suspense fallback={<span>&nbsp;</span>}>
          <CampaignRetrieveController campaignSEOFriendlyPath={campaignSEOFriendlyPath} campaignXWeVoteId={campaignXWeVoteId} />
        </Suspense>
        <Helmet title={`Edit Your Campaign - ${chosenWebsiteName}`} />
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
                  <CampaignTitleInputField
                    campaignTitlePlaceholder="Title of your campaign"
                    campaignXWeVoteId={campaignXWeVoteId}
                    editExistingCampaign={editExistingCampaign}
                  />
                  <EditPoliticianList
                    campaignXWeVoteId={campaignXWeVoteId}
                    editExistingCampaign={editExistingCampaign}
                  />
                  <AddCandidateInputField
                    campaignXWeVoteId={campaignXWeVoteId}
                    editExistingCampaign={editExistingCampaign}
                  />
                  <PhotoUploadWrapper>
                    Try to upload a photo that is 1200 x 628 pixels or larger. We can accept one photo up to 5 megabytes in size.
                    <CampaignPhotoUpload
                      campaignXWeVoteId={campaignXWeVoteId}
                      editExistingCampaign={editExistingCampaign}
                    />
                  </PhotoUploadWrapper>
                  <CampaignDescriptionInputField
                    campaignXWeVoteId={campaignXWeVoteId}
                    editExistingCampaign={editExistingCampaign}
                  />
                </CampaignStartSection>
              </CampaignStartSectionWrapper>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}
CampaignStartEditAll.propTypes = {
  classes: PropTypes.object,
  editExistingCampaign: PropTypes.bool,
  match: PropTypes.object,
  setShowHeaderFooter: PropTypes.func,
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

const PhotoUploadWrapper = styled.div`
  margin-top: 32px;
`;

export default withStyles(styles)(CampaignStartEditAll);
