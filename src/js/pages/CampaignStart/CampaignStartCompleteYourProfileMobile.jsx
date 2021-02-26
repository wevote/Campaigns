import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Close } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CompleteYourProfile from '../../components/CampaignStart/CompleteYourProfile';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

class CampaignStartCompleteYourProfileMobile extends Component {
  static getProps () {
    return {};
  }

  cancelFunction = () => {
    // console.log('CampaignStartCompleteYourProfileMobile cancelFunction');
    historyPush('/start-a-campaign-preview');
  };

  render () {
    renderLog('About');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    return (
      <div>
        <Helmet title="About - We Vote Campaigns" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                Complete Your Profile
                <IconButton
                  aria-label="Close"
                  classes={{ root: classes.closeButton }}
                  onClick={() => { this.cancelFunction(); }}
                  id="campaignStartCompleteYourProfileModalClose"
                >
                  <Close />
                </IconButton>
              </ContentTitle>
              <CompleteYourProfile />
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}
CampaignStartCompleteYourProfileMobile.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

const ContentTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 15px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
  }
`;

const InnerWrapper = styled.div`
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 480px;
`;

export default withStyles(styles)(CampaignStartCompleteYourProfileMobile);
