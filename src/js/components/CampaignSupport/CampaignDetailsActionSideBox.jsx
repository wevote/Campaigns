import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import CampaignStore from '../../stores/CampaignStore';
import CampaignSupporterStore from '../../stores/CampaignSupporterStore';
import { renderLog } from '../../utils/logging';
import SupportButton from './SupportButton';
import VoterStore from '../../stores/VoterStore';

const CompleteYourProfile = React.lazy(() => import('../Settings/CompleteYourProfile'));
const MostRecentCampaignSupport = React.lazy(() => import('../CampaignSupport/MostRecentCampaignSupport'));
const VisibleToPublicCheckbox = React.lazy(() => import('../CampaignSupport/VisibleToPublicCheckbox'));


class CampaignDetailsActionSideBox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      campaignSupported: false,
      voterProfileIsComplete: false,
      voterWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('CampaignDetailsActionSideBox componentDidMount');
    this.onCampaignSupporterStoreChange();
    this.onVoterStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.campaignSupportStoreListener = CampaignSupporterStore.addListener(this.onCampaignSupporterStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CampaignDetailsActionSideBox componentDidUpdate');
    const {
      campaignSEOFriendlyPath: campaignSEOFriendlyPathPrevious,
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.pullCampaignXSupporterVoterEntry(campaignXWeVoteId);
      }
    } else if (campaignSEOFriendlyPath) {
      if (campaignSEOFriendlyPath !== campaignSEOFriendlyPathPrevious) {
        const campaignXWeVoteIdCalculated = CampaignStore.getCampaignXWeVoteIdFromCampaignSEOFriendlyPath(campaignSEOFriendlyPath);
        // console.log('campaignXWeVoteIdCalculated:', campaignXWeVoteIdCalculated);
        this.pullCampaignXSupporterVoterEntry(campaignXWeVoteIdCalculated);
      }
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CampaignDetailsActionSideBox caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('CampaignDetailsActionSideBox componentWillUnmount');
    this.campaignStoreListener.remove();
    this.campaignSupportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in CampaignDetailsActionSideBox: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCampaignStoreChange () {
    this.onCampaignSupporterStoreChange();
  }

  onCampaignSupporterStoreChange () {
    const {
      campaignSEOFriendlyPath,
      campaignXWeVoteId,
    } = this.props;
    // console.log('CampaignDetailsActionSideBox onCampaignSupporterStoreChange campaignXWeVoteId:', campaignXWeVoteId, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (campaignXWeVoteId) {
      this.pullCampaignXSupporterVoterEntry(campaignXWeVoteId);
    } else if (campaignSEOFriendlyPath) {
      const campaignXWeVoteIdCalculated = CampaignStore.getCampaignXWeVoteIdFromCampaignSEOFriendlyPath(campaignSEOFriendlyPath);
      this.pullCampaignXSupporterVoterEntry(campaignXWeVoteIdCalculated);
    }
  }

  onVoterStoreChange () {
    const { voterProfileIsComplete: voterProfileIsCompletePrevious, voterWeVoteId: voterWeVoteIdPrevious } = this.state;
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    const voterProfileIsComplete = (voterFirstName && voterLastName && voterIsSignedInWithEmail) || false;
    // console.log('CampaignDetailsActionSideBox onVoterStoreChange voterProfileIsComplete:', voterProfileIsComplete, ', voterWeVoteId:', voterWeVoteId);
    // if (voterProfileIsComplete !== voterProfileIsCompletePrevious || voterWeVoteId !== voterWeVoteIdPrevious) {
    this.setState({
      voterProfileIsComplete,
      voterWeVoteId,
    });
    // }
  }

  pullCampaignXSupporterVoterEntry = (campaignXWeVoteId) => {
    // console.log('pullCampaignXSupporterVoterEntry campaignXWeVoteId:', campaignXWeVoteId);
    if (campaignXWeVoteId) {
      const campaignXSupporterVoterEntry = CampaignSupporterStore.getCampaignXSupporterVoterEntry(campaignXWeVoteId);
      // console.log('onCampaignSupporterStoreChange campaignXSupporterVoterEntry:', campaignXSupporterVoterEntry);
      const {
        campaign_supported: campaignSupported,
        campaignx_we_vote_id: campaignXWeVoteIdFromCampaignXSupporter,
      } = campaignXSupporterVoterEntry;
      // console.log('onCampaignSupporterStoreChange campaignSupported: ', campaignSupported);
      if (campaignXWeVoteIdFromCampaignXSupporter) {
        this.setState({
          campaignSupported,
        });
      } else {
        this.setState({
          campaignSupported: false,
        });
      }
    } else {
      this.setState({
        campaignSupported: false,
      });
    }
  }

  onKeyDown = (event) => {
    event.preventDefault();
  };

  render () {
    renderLog('CampaignDetailsActionSideBox');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignSEOFriendlyPath, campaignXWeVoteId, classes } = this.props;
    // console.log('CampaignDetailsActionSideBox render campaignXWeVoteId:', campaignXWeVoteId, ', campaignSEOFriendlyPath:', campaignSEOFriendlyPath);
    if (!campaignSEOFriendlyPath && !campaignXWeVoteId) {
      // console.log('CampaignDetailsActionSideBox render voter NOT found');
      return <div className="undefined-campaign-state" />;
    }

    const {
      campaignSupported, voterProfileIsComplete, voterWeVoteId,
    } = this.state;
    if (!voterWeVoteId) {
      // console.log('CampaignDetailsActionSideBox render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('CampaignDetailsActionSideBox render voter found');
    const hideFooterBehindModal = false;
    const supportButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <Wrapper>
        {campaignSupported ? (
          <KeepHelpingWrapper
            className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
          >
            <ButtonPanel>
              <Button
                classes={{ root: supportButtonClasses }}
                color="primary"
                id="keepHelpingButtonDesktop"
                onClick={() => this.props.functionToUseToKeepHelping()}
                variant="contained"
              >
                I&apos;d like to keep helping!
              </Button>
            </ButtonPanel>
          </KeepHelpingWrapper>
        ) : (
          <section>
            <MostRecentCampaignSupport />
            {voterProfileIsComplete ? (
              <ProfileAlreadyComplete>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <VisibleToPublicCheckbox campaignXWeVoteId={campaignXWeVoteId} />
                </Suspense>
                <SupportButton functionToUseWhenProfileComplete={this.props.functionToUseWhenProfileComplete} />
              </ProfileAlreadyComplete>
            ) : (
              <CompleteYourProfileWrapper>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <CompleteYourProfile
                    campaignXWeVoteId={campaignXWeVoteId}
                    functionToUseWhenProfileComplete={this.props.functionToUseWhenProfileComplete}
                    supportCampaignOnCampaignHome
                  />
                </Suspense>
              </CompleteYourProfileWrapper>
            )}
          </section>
        )}
      </Wrapper>
    );
  }
}
CampaignDetailsActionSideBox.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  campaignSEOFriendlyPath: PropTypes.string,
  classes: PropTypes.object,
  functionToUseToKeepHelping: PropTypes.func.isRequired,
  functionToUseWhenProfileComplete: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
      padding: '0',
    },
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
});

const ButtonPanel = styled.div`
  background-color: #fff;
  padding: 10px 0;
`;

const CompleteYourProfileWrapper = styled.div`
  margin-top: 20px;
`;

const KeepHelpingWrapper = styled.div`
  width: 100%;
  display: block;
`;

const ProfileAlreadyComplete = styled.div`
`;

const Wrapper = styled.div`
`;

export default withTheme(withStyles(styles)(CampaignDetailsActionSideBox));
