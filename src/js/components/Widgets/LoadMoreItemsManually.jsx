import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';

class LoadMoreItemsManually extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog('ShowMoreFooter');  // Set LOG_RENDER_EVENTS to log all renders
    const { showMoreId, showMoreLink } = this.props;

    let { showMoreText } = this.props;
    if (!showMoreText) {
      showMoreText = 'Show more';
    }

    return (
      <ShowMoreFooterStyled className="card-child" id={showMoreId} onClick={showMoreLink}>
        <ShowMoreFooterText>
          { showMoreText }
        </ShowMoreFooterText>
      </ShowMoreFooterStyled>
    );
  }
}
LoadMoreItemsManually.propTypes = {
  showMoreId: PropTypes.string.isRequired,
  showMoreLink: PropTypes.func.isRequired,
  showMoreText: PropTypes.string,
};

const ShowMoreFooterStyled = styled.div`
  border: 0px !important;
  color: #2e3c5d;
  cursor: pointer;
  display: block !important;
  background: #fff !important;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0px !important;
  margin-top: 0px !important;
  padding: 0px !important;
  text-align: right !important;
  user-select: none;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 18px;
  }
  &:hover {
    background-color: rgba(46, 60, 93, 0.15) !important;
    transition-duration: .2s;
  }
  @media print{
    display: none;
  }
`;

const ShowMoreFooterText = styled.div`
  margin-top: 8px !important;
  padding: 8px !important;
  padding-bottom: 0px !important;
  text-align: right !important;
  &:hover {
    text-decoration: underline;
  }
`;

export default withTheme(LoadMoreItemsManually);

