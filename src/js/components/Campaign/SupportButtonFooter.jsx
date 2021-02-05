import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { historyPush, isCordova } from '../../utils/cordovaUtils';

class SupportButtonFooter extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('SupportButtonFooter');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SupportButtonFooter window.location.href: ${window.location.href}`);
    }
    const { classes } = this.props;
    const hideFooterBehindModal = false;
    const supportButtonClasses = classes.buttonDefault; // isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    return (
      <div>
        <Wrapper
          className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
        >
          <ButtonPanel>
            <Button
              classes={{ root: supportButtonClasses }}
              color="primary"
              id="supportButtonFooter"
              onClick={() => historyPush('/c/')}
              variant="contained"
            >
              Support this campaign
            </Button>
          </ButtonPanel>
        </Wrapper>
      </div>
    );
  }
}
SupportButtonFooter.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: 20,
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonDefaultCordova: {
    boxShadow: 'none !important',
    fontSize: 20,
    height: '35px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
});

const ButtonPanel = styled.div`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

export default withStyles(styles)(SupportButtonFooter);
