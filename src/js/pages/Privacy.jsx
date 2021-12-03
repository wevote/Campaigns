import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import PrivacyBody from '../common/components/PrivacyBody';
import { renderLog } from '../common/utils/logging';

class Privacy extends Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  render () {
    renderLog('Privacy');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="Privacy Policy - WeVote.US Campaigns" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <PrivacyBody />
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}

const InnerWrapper = styled.div`
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 15px;
`;

const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

export default Privacy;
