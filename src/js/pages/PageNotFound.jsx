import { Ballot } from '@mui/icons-material';
import { Button } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import historyPush from '../common/utils/historyPush';
import { renderLog } from '../common/utils/logging';
import AppObservableStore, { messageService } from '../stores/AppObservableStore';

class PageNotFound extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenWebsiteName: '',
    };
  }

  componentDidMount () {
    // console.log('PageNotFound componentDidMount');
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const chosenWebsiteName = AppObservableStore.getChosenWebsiteName();
    this.setState({
      chosenWebsiteName,
    });
  }

  render () {
    renderLog('PageNotFound');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { chosenWebsiteName } = this.state;
    return (
      <div>
        <Helmet title={`Page Not Found - ${chosenWebsiteName}`} />
        <PageWrapperNotFound>
          <EmptyBallotMessageContainer>
            <EmptyBallotText>Page not found.</EmptyBallotText>
            <Button
              classes={{ root: classes.buttonRoot }}
              color="primary"
              variant="contained"
              onClick={() => historyPush('/')}
            >
              <Ballot classes={{ root: classes.buttonIconRoot }} location={window.location} />
              Go to Home Page
            </Button>
          </EmptyBallotMessageContainer>
        </PageWrapperNotFound>
      </div>
    );
  }
}
PageNotFound.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  buttonIconRoot: {
    marginRight: 8,
  },
  buttonRoot: {
    textTransform: 'none',
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const EmptyBallotMessageContainer = styled('div')`
  padding: 3em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyBallotText = styled('p')(({ theme }) => (`
  font-size: 24px;
  text-align: center;
  margin: 1em 2em 3em;
  ${theme.breakpoints.down('md')} {
    margin: 1em;
  }
`));

const PageWrapperNotFound = styled('div')`
  margin: 0 15px;
`;

export default withStyles(styles)(PageNotFound);
