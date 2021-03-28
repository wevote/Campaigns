import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AppStore from '../../stores/AppStore';
import MainFooterWeVote from './MainFooterWeVote';
import MainFooterPrivateLabeled from './MainFooterPrivateLabeled';


class MainFooter extends Component {
  render () {
    const { displayFooter } = this.props;
    const disp = displayFooter !== undefined ? displayFooter : true;

    if (!disp) {
      return null;
    }

    const inPrivateLabelMode = AppStore.getHideWeVoteLogo(); // Using this setting temporarily

    return (
      <OuterWrapper>
        <InnerWrapper>
          {inPrivateLabelMode ? (
            <MainFooterPrivateLabeled />
          ) : (
            <MainFooterWeVote />
          )}
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}
MainFooter.propTypes = {
  displayFooter: PropTypes.bool,
};

const styles = () => ({
});

const InnerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 960px;
  padding: 30px 0;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-bottom: 100px;
  }
`;

const OuterWrapper = styled.div`
  background-color: #f6f4f6;
  border-top: 1px solid #ddd;
  margin-top: 30px;
  width: 100%;
`;

export default withStyles(styles)(MainFooter);
