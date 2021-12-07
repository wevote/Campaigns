import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { OuterWrapper, PageWrapper } from '../common/components/Style/stepDisplayStyles';
import { renderLog } from '../common/utils/logging';
import { lazyLoader, libraryNeedsLoading } from '../utils/lazyLoader';

class About extends Component {
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
    renderLog('About');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="About - WeVote.US Campaigns" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                About We Vote
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

export default withStyles(styles)(About);
