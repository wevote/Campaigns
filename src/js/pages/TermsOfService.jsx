import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import TermsOfServiceBody from '../common/components/TermsOfServiceBody';
import { renderLog } from '../common/utils/logging';

class TermsOfService extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('TermsOfService');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="Terms of Service - WeVote.US Campaigns" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <TermsOfServiceBody />
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

export default TermsOfService;
