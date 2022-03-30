import styled from 'styled-components';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PrivacyBody from '../common/components/PrivacyBody';
import { OuterWrapper, PageWrapper } from '../common/components/Style/stepDisplayStyles';
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

const InnerWrapper = styled('div')``;

export default Privacy;
