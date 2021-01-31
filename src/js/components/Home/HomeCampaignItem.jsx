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
        <OneCampaignContainer>
          <OneCampaignTitle>
            Home Campaign Item -
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
  classes: PropTypes.object,
};

const Wrapper = styled.div`
  @media (max-width: ${({ theme, cordova }) => (cordova ? undefined : theme.breakpoints.md)}) {
    margin: 1em 0;
  }
`;

const OneCampaignContainer = styled.div`
`;

const OneCampaignTitle = styled.h4`
  font-size: 18px;
  margin: 4px 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 4px 0;
  }
`;

const styles = (theme) => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

export default withStyles(styles)(HomeCampaignItem);
