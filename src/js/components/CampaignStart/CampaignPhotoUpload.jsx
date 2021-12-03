import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import CampaignStartActions from '../../actions/CampaignStartActions';
import CampaignStartStore from '../../stores/CampaignStartStore';
import CampaignStore from '../../stores/CampaignStore';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';

const muiTheme = createMuiTheme({
  overrides: {
    MuiDropzonePreviewList: {
      image: {
        maxWidth: 'auto',
      },
    },
  },
});

class CampaignPhotoUpload extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };

    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount () {
    // console.log('CampaignPhotoUpload, componentDidMount');
    this.campaignStartStoreListener = CampaignStartStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStartStoreChange.bind(this));
    this.onCampaignStartStoreChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignPhotoUpload componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStartStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.campaignStartStoreListener.remove();
    this.campaignStoreListener.remove();
    // TODO Figure out how to add fileReader.removeEventListener
    // if (this.fileReader) {
    //   this.fileReader.removeEventListener('load', this.cachePhotoFromFileReader, false);
    //   this.fileReader = null;
    // }
  }

  handleDrop (files) {
    if (files && files[0]) {
      const fileFromDropzone = files[0];
      if (!fileFromDropzone) return;
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        const photoFromFileReader = fileReader.result;
        // console.log('photoFromFileReader:', photoFromFileReader);
        CampaignStartActions.campaignPhotoQueuedToSave(photoFromFileReader);
      });
      fileReader.readAsDataURL(fileFromDropzone);
      // An attempt at figuring out how to removeEventListener
      // this.fileReader = new FileReader();
      // this.fileReader.addEventListener('load', () => {
      //   const photoFromFileReader = this.fileReader.result;
      //   // console.log('photoFromFileReader:', photoFromFileReader);
      //   CampaignStartActions.campaignPhotoQueuedToSave(photoFromFileReader);
      // });
      // this.fileReader.addEventListener('load', () => this.cachePhotoFromFileReader);
      // this.fileReader.readAsDataURL(fileFromDropzone);
    }
  }

  onCampaignStartStoreChange () {
    const { campaignXWeVoteId, editExistingCampaign } = this.props;
    let campaignPhotoLargeUrl = '';
    if (editExistingCampaign) {
      const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
      if (campaignX && campaignX.campaignx_we_vote_id) {
        campaignPhotoLargeUrl = campaignX.we_vote_hosted_campaign_photo_large_url;
      }
    } else {
      campaignPhotoLargeUrl = CampaignStartStore.getCampaignPhotoLargeUrl();
    }
    const campaignPhotoQueuedToDelete = CampaignStartStore.getCampaignPhotoQueuedToDelete();
    const campaignPhotoQueuedToDeleteSet = CampaignStartStore.getCampaignPhotoQueuedToDeleteSet();
    this.setState({
      campaignPhotoLargeUrl,
      campaignPhotoQueuedToDelete,
      campaignPhotoQueuedToDeleteSet,
    });
  }

  // cachePhotoFromFileReader = () => {
  //   const photoFromFileReader = this.fileReader.result;
  //   // console.log('photoFromFileReader:', photoFromFileReader);
  //   CampaignStartActions.campaignPhotoQueuedToSave(photoFromFileReader);
  //   return true;
  // }

  markCampaignImageForDelete = () => {
    CampaignStartActions.campaignPhotoQueuedToDelete(true);
  }

  render () {
    renderLog('CampaignPhotoUpload');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes } = this.props;
    const { campaignPhotoLargeUrl, campaignPhotoQueuedToDelete, campaignPhotoQueuedToDeleteSet } = this.state;
    let campaignPhotoExists = false;
    let dropzoneText = isMobileScreenSize() ? 'Upload campaign photo' : 'Drag campaign photo here (or click to find file)';
    if (campaignPhotoLargeUrl) {
      campaignPhotoExists = true;
      dropzoneText = isMobileScreenSize() ? 'Upload new photo' : 'Drag new photo here (or click to find file)';
    }
    const campaignPhotoMarkedForDeletion = Boolean(campaignPhotoQueuedToDelete && campaignPhotoQueuedToDeleteSet);
    // console.log('campaignPhotoMarkedForDeletion:', campaignPhotoMarkedForDeletion);
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              {(campaignPhotoExists && !campaignPhotoMarkedForDeletion) ? (
                <OverlayOuterWrapper>
                  <OverlayInnerWrapper>
                    <CampaignImageDeleteButtonOuterWrapper>
                      <CampaignImageDeleteButtonInnerWrapper>
                        <Button
                          classes={{ root: classes.buttonDelete }}
                          color="primary"
                          id="deleteCurrent Image"
                          onClick={this.markCampaignImageForDelete}
                          variant="contained"
                        >
                          Delete
                        </Button>
                      </CampaignImageDeleteButtonInnerWrapper>
                    </CampaignImageDeleteButtonOuterWrapper>
                    <CampaignImageWrapper>
                      <CampaignImage src={campaignPhotoLargeUrl} alt="Campaign" />
                    </CampaignImageWrapper>
                  </OverlayInnerWrapper>
                </OverlayOuterWrapper>
              ) : (
                <MuiThemeProvider theme={muiTheme}>
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    classes={{
                      icon: classes.dropzoneIcon,
                      root: classes.dropzoneRoot,
                    }}
                    dropzoneText={dropzoneText}
                    filesLimit={1}
                    initialFiles={campaignPhotoExists ? [campaignPhotoLargeUrl] : undefined}
                    maxFileSize={6000000}
                    onChange={this.handleDrop}
                  />
                </MuiThemeProvider>
              )}
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
CampaignPhotoUpload.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  editExistingCampaign: PropTypes.bool,
};

const styles = (theme) => ({
  buttonDelete: {
    backgroundColor: '#f44336',
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '35px !important',
    '&:hover': {
      backgroundColor: '#8C001A',
    },
    marginLeft: 10,
    padding: '0 30px',
    textTransform: 'none',
    width: 100,
  },
  dropzoneIcon: {
    color: '#999',
  },
  dropzoneRoot: {
    color: '#999',
    [theme.breakpoints.down('sm')]: {
      minHeight: '160px',
    },
  },
});

const CampaignImage = styled.img`
  width: 100%;
`;

const CampaignImageWrapper = styled.div`
  margin-top: ${({ ipad }) => (ipad ? '-11px' : '-44px')};
`;

const CampaignImageDeleteButtonOuterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  position: relative;
  z-index: 1;
  transform: ${({ ipad }) => (ipad ? 'translate(0%, 100%)' : '')}
`;

const CampaignImageDeleteButtonInnerWrapper = styled.div`
  margin-right: 8px;
  z-index: 2;
`;

const ColumnFullWidth = styled.div`
  padding: 8px 12px;
  width: 100%;
`;

const OverlayOuterWrapper = styled.div`
  align-self: flex-end;
  // width: 640px;
  display: flex;
  // padding: 0 15px;
`;

const OverlayInnerWrapper = styled.div`
  min-height: 37px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  margin-top: 10px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(CampaignPhotoUpload);
