import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { withStyles, withTheme } from '@material-ui/core/styles';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import SupportButton from './SupportButton';
import VoterStore from '../../stores/VoterStore';

const CompleteYourProfile = React.lazy(() => import('../Settings/CompleteYourProfile'));
const MostRecentCampaignSupport = React.lazy(() => import('../CampaignSupport/MostRecentCampaignSupport'));
const VisibleToPublicCheckbox = React.lazy(() => import('../CampaignSupport/VisibleToPublicCheckbox'));


class CompleteYourProfileOnCampaignDetails extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterProfileIsComplete: false,
    };
  }

  componentDidMount () {
    // console.log('CompleteYourProfileOnCampaignDetails componentDidMount');
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CompleteYourProfileOnCampaignDetails caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('CompleteYourProfileOnCampaignDetails componentWillUnmount');
    this.voterStoreListener.remove();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in CompleteYourProfileOnCampaignDetails: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onVoterStoreChange () {
    const { voterProfileIsComplete: voterProfileIsCompletePrevious, voterWeVoteId: voterWeVoteIdPrevious } = this.state;
    const voterFirstName = VoterStore.getFirstName();
    const voterLastName = VoterStore.getLastName();
    const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    const voterWeVoteId = VoterStore.getVoterWeVoteId();
    const voterProfileIsComplete = (voterFirstName && voterLastName && voterIsSignedInWithEmail) || false;
    // console.log('CompleteYourProfileOnCampaignDetails onVoterStoreChange voterProfileIsComplete:', voterProfileIsComplete, ', voterWeVoteId:', voterWeVoteId);
    if (voterProfileIsComplete !== voterProfileIsCompletePrevious || voterWeVoteId !== voterWeVoteIdPrevious) {
      this.setState({
        voterProfileIsComplete,
        voterWeVoteId,
      });
    }
  }

  onKeyDown = (event) => {
    event.preventDefault();
  };

  render () {
    renderLog('CompleteYourProfileOnCampaignDetails');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignSEOFriendlyPath, campaignXWeVoteId } = this.props;

    const {
      voterProfileIsComplete, voterWeVoteId,
    } = this.state;
    if (!voterWeVoteId) {
      // console.log('CompleteYourProfileOnCampaignDetails render voter NOT found');
      return <div className="undefined-props" />;
    }
    // console.log('CompleteYourProfileOnCampaignDetails render voter found');
    return (
      <Wrapper>
        <section>
          <MostRecentCampaignSupport />
          {voterProfileIsComplete ? (
            <ProfileAlreadyComplete>
              <Suspense fallback={<span>&nbsp;</span>}>
                <VisibleToPublicCheckbox />
              </Suspense>
              <SupportButton functionToUseWhenProfileComplete={this.props.functionToUseWhenProfileComplete} />
            </ProfileAlreadyComplete>
          ) : (
            <CompleteYourProfileWrapper>
              <Suspense fallback={<span>&nbsp;</span>}>
                <CompleteYourProfile
                  campaignSEOFriendlyPath={campaignSEOFriendlyPath}
                  campaignXWeVoteId={campaignXWeVoteId}
                  functionToUseWhenProfileComplete={this.props.functionToUseWhenProfileComplete}
                  supportCampaignOnCampaignHome
                />
              </Suspense>
            </CompleteYourProfileWrapper>
          )}
        </section>
      </Wrapper>
    );
  }
}
CompleteYourProfileOnCampaignDetails.propTypes = {
  campaignXWeVoteId: PropTypes.string,
  campaignSEOFriendlyPath: PropTypes.string,
  functionToUseWhenProfileComplete: PropTypes.func.isRequired, // pathToUseWhenProfileComplete
};

const styles = () => ({
  buttonDesktop: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  link: {
    color: '#999',
    '&:hover': {
      color: '#4371cc',
    },
  },
});

const CompleteYourProfileWrapper = styled.div`
  margin-top: 20px;
`;

const ProfileAlreadyComplete = styled.div`
`;

const Wrapper = styled.div`
`;

export default withTheme(withStyles(styles)(CompleteYourProfileOnCampaignDetails));
