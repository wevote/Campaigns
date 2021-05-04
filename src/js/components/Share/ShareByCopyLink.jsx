import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, withTheme } from '@material-ui/core/styles';
import AppStore from '../../stores/AppStore';
import CampaignStore from '../../stores/CampaignStore';
import { openSnackbar } from '../Widgets/SnackNotifier';
import { renderLog } from '../../utils/logging';

class ShareByCopyLink extends Component {
  constructor (props) {
    super(props);
    this.state = {
      copyLinkCopied: false,
      shareModalStep: '',
    };

    this.copyLink = this.copyLink.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount () {
    // console.log('ShareByCopyLink componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.onAppStoreChange();
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('ShareByCopyLink componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentWillUnmount () {
    // console.log('componentWillUnmount');
    this.appStoreListener.remove();
    this.campaignStoreListener.remove();
  }

  onAppStoreChange () {
    const { shareModalStep } = this.state;
    const newShareModalStep = AppStore.shareModalStep();
    if (newShareModalStep !== shareModalStep) {
      // If we change modes, reset the copy link state
      this.setState({
        copyLinkCopied: false,
      });
    }
    this.setState({
      shareModalStep: newShareModalStep,
    });
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    const campaignX = CampaignStore.getCampaignXByWeVoteId(campaignXWeVoteId);
    this.setState({
      campaignX,
    });
  }

  onClick = () => {
    // console.log('ShareByCopyLink onClick function');
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
  }

  generateFullCampaignLink = () => {
    const { hostname } = window.location;
    const domainAddress = `https://${hostname}`;
    const { campaignX } = this.state;
    // console.log('domainAddress:', domainAddress);
    if (!campaignX) {
      return domainAddress;
    }
    const {
      seo_friendly_path: SEOFriendlyPath,
      campaignx_we_vote_id: campaignXWeVoteId,
    } = campaignX;
    if (SEOFriendlyPath) {
      return `${domainAddress}/c/${SEOFriendlyPath}`;
    } else {
      return `${domainAddress}/id/${campaignXWeVoteId}`;
    }
  }

  copyLink () {
    // console.log('ShareByCopyLink copyLink');
    openSnackbar({ message: 'Copied!' });
    this.setState({
      copyLinkCopied: true,
    });
    if (this.props.onClickFunction) {
      this.props.onClickFunction();
    }
  }

  render () {
    renderLog('ShareByCopyLink');  // Set LOG_RENDER_EVENTS to log all renders
    const { darkButton, mobileMode, uniqueExternalId } = this.props;
    const { copyLinkCopied } = this.state;
    const linkToBeShared = this.generateFullCampaignLink();
    return (
      <Wrapper>
        <CopyToClipboard text={linkToBeShared} onCopy={this.copyLink}>
          <div className={mobileMode ? 'material_ui_button_mobile' : ''} id={`shareByCopyLink-${uniqueExternalId}`}>
            <div className={darkButton ? 'material_ui_dark_button' : 'material_ui_light_button'}>
              <div>
                {copyLinkCopied ? 'Link Copied!' : 'Copy Link'}
              </div>
            </div>
          </div>
        </CopyToClipboard>
      </Wrapper>
    );
  }
}
ShareByCopyLink.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  darkButton: PropTypes.bool,
  mobileMode: PropTypes.bool,
  onClickFunction: PropTypes.func,
  uniqueExternalId: PropTypes.string,
};

const styles = () => ({
  copyLinkIcon: {
    background: '#000',
  },
  copyLinkIconCopied: {
    background: '#1fc06f',
  },
});

const Wrapper = styled.div`
  cursor: pointer;
  display: block !important;
  margin-bottom: 12px;
  @media (min-width: 600px) {
    flex: 1 1 0;
  }
  height: 100%;
  text-align: center;
  text-decoration: none !important;
  color: black !important;
  transition-duration: .25s;
  &:hover {
    text-decoration: none !important;
    color: black !important;
    transition-duration: .25s;
  }
  @media (max-width: 600px) {
    width: 33.333%;
  }
  @media (max-width: 476px) {
    width: 50%;
  }
`;

export default withTheme(withStyles(styles)(ShareByCopyLink));
