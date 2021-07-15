import React, { Component } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';

const muiTheme = createMuiTheme({
  overrides: {
    MuiDropzonePreviewList: {
      image: {
        maxWidth: 'auto',
      },
    },
  },
});

class VoterPhotoUpload extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterPhotoUrlLarge: '',
    };

    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount () {
    // console.log('VoterPhotoUpload, componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    // TODO Figure out how to add fileReader.removeEventListener
  }

  handleDrop (files) {
    if (files && files[0]) {
      const fileFromDropzone = files[0];
      if (!fileFromDropzone) return;
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        const photoFromFileReader = fileReader.result;
        // console.log('photoFromFileReader:', photoFromFileReader);
        VoterActions.voterPhotoQueuedToSave(photoFromFileReader);
      });
      fileReader.readAsDataURL(fileFromDropzone);
    }
  }

  onVoterStoreChange () {
    const voterPhotoUrlLarge = VoterStore.getVoterPhotoUrlLarge();
    this.setState({
      voterPhotoUrlLarge,
    });
  }

  submitDeleteYourPhoto = () => {
    VoterActions.voterPhotoDelete();
    VoterActions.voterPhotoQueuedToSave(undefined);
  }

  render () {
    renderLog('VoterPhotoUpload');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes } = this.props;
    const { voterPhotoUrlLarge } = this.state;
    let dropzoneText = isMobileScreenSize() ? 'Upload profile photo' : 'Drag your profile photo here (or click to find file)';
    if (voterPhotoUrlLarge) {
      dropzoneText = isMobileScreenSize() ? 'Upload new photo' : 'Drag new profile photo here (or click to find file)';
    }
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              {voterPhotoUrlLarge ? (
                <VoterPhotoWrapper>
                  <VoterPhotoImage src={voterPhotoUrlLarge} alt="Profile Photo" />
                  <DeleteLink
                    className="u-link-color u-link-underline u-cursor--pointer"
                    onClick={this.submitDeleteYourPhoto}
                  >
                    delete
                  </DeleteLink>
                </VoterPhotoWrapper>
              ) : (
                <MuiThemeProvider theme={muiTheme}>
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    classes={{
                      icon: classes.dropzoneIcon,
                      root: classes.dropzoneRoot,
                      text: classes.dropzoneText,
                    }}
                    dropzoneText={dropzoneText}
                    filesLimit={1}
                    Icon={AccountCircle}
                    initialFiles={voterPhotoUrlLarge ? [voterPhotoUrlLarge] : undefined}
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
VoterPhotoUpload.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  dropzoneIcon: {
    color: '#999',
  },
  dropzoneRoot: {
    color: '#999',
    minHeight: '162px',
    [theme.breakpoints.down('sm')]: {
      minHeight: '160px',
    },
  },
  dropzoneText: {
    color: '#818181',
    fontSize: '18px',
    fontFamily: "'Nunito Sans', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    fontWeight: '300',
    paddingLeft: 5,
    paddingRight: 5,
  },
});

const ColumnFullWidth = styled.div`
  padding: 8px 12px;
  width: 100%;
`;

const DeleteLink = styled.div`
`;

const VoterPhotoImage = styled.img`
  border-radius: 100px;
  max-width: 200px;
`;

const VoterPhotoWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 15px;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(VoterPhotoUpload);
