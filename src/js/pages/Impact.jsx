import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { lazyLoader, libraryNeedsLoading } from '../utils/lazyLoader';
import { renderLog } from '../common/utils/logging';

class Impact extends Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    const library = 'fontawesome';
    if (libraryNeedsLoading(library)) {
      lazyLoader(library)
        .then((result) => {
          console.log('lazy loader for fontawesome returned: ', result);
          // eslint-disable-next-line react/no-unused-state
          this.setState({ result }); // to force a reload
        });
    }
  }

  render () {
    renderLog('Impact');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="Impact - WeVote.US Campaigns" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                We Vote&apos;s Impact
              </ContentTitle>
              Text coming soon. Text coming soon. Text coming soon. Text coming soon. Text coming soon. Text coming soon. Text coming soon. Text coming soon. Text coming soon. Text coming soon.
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

const ContentTitle = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
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
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

export default withStyles(styles)(Impact);
