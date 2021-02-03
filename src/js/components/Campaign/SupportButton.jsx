import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { historyPush, isCordova } from '../../utils/cordovaUtils';

class SupportButton extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('SupportButton');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`SupportButton window.location.href: ${window.location.href}`);
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
SupportButton.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonDefault: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    height: '45px !important',
    [theme.breakpoints.down('md')]: {
      fontSize: '12px',
      padding: '0',
    },
  },
  buttonDefaultCordova: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    height: '35px !important',
  },
});

const ButtonPanel = styled.div`
  background-color: #fff;
  padding: 10px 0;
`;

const Wrapper = styled.div`
  width: 100%;
  display: block;
`;

export default withStyles(styles)(SupportButton);
