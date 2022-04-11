import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { isCordova } from '../common/utils/isCordovaOrWebApp';
import { renderLog } from '../common/utils/logging';


class StyleGuidePage extends Component {
  // static getProps () {
  //   return {};
  // }

  render () {
    renderLog('StyleGuidePage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`StyleGuidePage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    return (
      <div>
        <Helmet title="Style Guide - WeVote.US Campaigns" />
        <Wrapper>
          <IntroductionMessageSection>
            <PageStatement>Style Guide</PageStatement>
          </IntroductionMessageSection>
          <StyleSection>
            <StyleItemLeft>
              <StyleTitleAndDescription>
                <StyleTitle>
                  TextDefault18px.
                </StyleTitle>
                Used for...
              </StyleTitleAndDescription>
              <TextDefault18px>
                The quick brown fox jumps over the lazy dog.
              </TextDefault18px>
            </StyleItemLeft>
            <StyleItemRight>
              <PreModified>
                {`const TextDefault18px = styled.div\`
  font-size: 18px;
\`;`}
              </PreModified>
            </StyleItemRight>
          </StyleSection>
          <StyleSection>
            <StyleItemLeft>
              <StyleTitleAndDescription>
                <StyleTitle>
                  TitleH3.
                </StyleTitle>
                Used for...
              </StyleTitleAndDescription>
              <TitleH3>
                The quick brown fox jumps over the lazy dog.
              </TitleH3>
            </StyleItemLeft>
            <StyleItemRight>
              <PreModified>
                {`const TitleH3 = styled.h3\`
  font-size: 22px;
  text-align: left;
\`;`}
              </PreModified>
            </StyleItemRight>
          </StyleSection>
        </Wrapper>
      </div>
    );
  }
}
// StyleGuidePage.propTypes = {
//   classes: PropTypes.object,
// };

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

const Wrapper = styled('div')(({ theme }) => (`
  margin: 0 15px;
  ${theme.breakpoints.down('md')} {
  }
`));

const IntroductionMessageSection = styled('div')(({ theme }) => (`
  padding: 1em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
  ${theme.breakpoints.down('md')} {
    padding: 1em;
  }
`));

const PageStatement = styled('h1')`
  font-size: 32px;
  text-align: center;
`;

const PreModified = styled('pre')`
  margin: 0 0;
`;

const StyleItemLeft = styled('div')`
`;

const StyleItemRight = styled('div')`
  background: #ddd;
  border: .5px solid #ddd;
  padding: 5px;
`;

const StyleSection = styled('div')`
  border-top: 1px solid #ddd;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin: 0 0 20px 0;
  padding-top: 20px;
`;

const StyleTitle = styled('span')`
  font-weight: bold;
  margin-right: 5px;
`;

const StyleTitleAndDescription = styled('div')`
  font-size: 18px;
`;

const TextDefault18px = styled('div')`
  font-size: 18px;
`;

const TitleH3 = styled('h3')`
  font-size: 22px;
  text-align: left;
`;

export default withStyles(styles)(StyleGuidePage);
