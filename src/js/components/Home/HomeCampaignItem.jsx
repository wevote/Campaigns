import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { historyPush, isCordova } from '../../utils/cordovaUtils';

class HomeCampaignItem extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('HomeCampaignItem');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`HomeCampaignItem window.location.href: ${window.location.href}`);
    }
    const { campaignWeVoteId } = this.props;
    return (
      <Wrapper cordova={isCordova()}>
        <OneCampaignContainer onClick={() => historyPush('/c/')}>
          <OneCampaignTitle>
            Sam Davis for Oakland School Board -
            {' '}
            {campaignWeVoteId}
          </OneCampaignTitle>
        </OneCampaignContainer>
      </Wrapper>
    );
  }
}
HomeCampaignItem.propTypes = {
  campaignWeVoteId: PropTypes.string,
  // classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const OneCampaignContainer = styled.div`
  cursor: pointer;
`;

const OneCampaignTitle = styled.h4`
  font-size: 18px;
  margin: 4px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 4px 0;
  }
`;

const Wrapper = styled.div`
  @media (max-width: ${({ theme, cordova }) => (cordova ? undefined : theme.breakpoints.md)}) {
    margin: 1em 0;
  }
`;

export default withStyles(styles)(HomeCampaignItem);
