import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import CreditsBody from '../common/components/CreditsBody';
import { OuterWrapper, PageWrapper } from '../common/components/Style/stepDisplayStyles';
import { renderLog } from '../common/utils/logging';


class Credits extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('Credits');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="Credits and Thanks - WeVote.US Campaigns" />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                Credits &amp; Thanks
              </ContentTitle>
              <Section>
                <CreditsBody />
              </Section>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
      </div>
    );
  }
}

const styles = (theme) => ({
  buttonContained: {
    borderRadius: 32,
    height: 50,
    [theme.breakpoints.down('md')]: {
      height: 36,
    },
  },
});

const ContentTitle = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 600;
  margin: 20px 0;
  ${theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`));

const InnerWrapper = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
`;

const Section = styled('div')`
  display: flex;
  flex-flow: column;
  text-align: center;
  align-items: center;
  width: 100%;
`;

export default withStyles(styles)(Credits);
