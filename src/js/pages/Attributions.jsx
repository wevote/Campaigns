import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../utils/logging';
import attributionText from '../constants/attributionText';
import compileDate from '../compiledDate';
import MainFooter from '../components/Navigation/MainFooter';
import MainHeaderBar from '../components/Navigation/MainHeaderBar';

class Attributions extends Component {
  static getProps () {
    return {};
  }

  static parseLicense (oneLicense) {
    const result = [];
    const lines = oneLicense.split('\n');
    for (let index = 0; index < lines.length; index++) {
      if (index === 0) {
        result.push(
          <div key={index}>
            <br />
            <b>{lines[index]}</b>
          </div>,
        );
      } else {
        result.push(
          <div key={index}>
            {lines[index]}
          </div>,
        );
      }
    }
    return result;
  }

  render () {
    renderLog('Attributions');  // Set LOG_RENDER_EVENTS to log all renders

    return (
      <div>
        <Helmet title="Attributions - We Vote Campaigns" />
        <MainHeaderBar />
        <PageWrapper>
          <OuterWrapper>
            <InnerWrapper>
              <ContentTitle>
                WeVote.US Open Source Software Licenses
              </ContentTitle>
              <div>
                Please also see
                {' '}
                <Link to="/credits">
                  Credits &amp; Thanks
                </Link>
                .
              </div>
              { attributionText.map((oneLicense) => (
                Attributions.parseLicense(oneLicense)
              ))}
              <CompileDate>
                Compile date:&nbsp;&nbsp;
                { compileDate }
              </CompileDate>
            </InnerWrapper>
          </OuterWrapper>
        </PageWrapper>
        <MainFooter />
      </div>
    );
  }
}
Attributions.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonRoot: {
    width: 250,
  },
});

const CompileDate = styled.div`
  margin: 20px 0;
`;

const ContentTitle = styled.div`
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

export default withStyles(styles)(Attributions);
