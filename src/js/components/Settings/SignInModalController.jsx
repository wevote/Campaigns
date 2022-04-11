import React, { Component } from 'react';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';
import SignInModal from './SignInModal';
import VoterActions from '../../actions/VoterActions';


// March 22, 2022 -- I don't think this component is needed, what is left here could just be merged into SignInModal
class SignInModalController extends Component {
  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterFirstRetrieve();
  }

  shouldComponentUpdate () {
    return AppObservableStore.showSignInModal();
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    this.setState({});
  }

  voterFirstRetrieve = () => {
    initializejQuery(() => {
      const voterFirstRetrieveInitiated = AppObservableStore.voterFirstRetrieveInitiated();
      // console.log('SignInModalController voterFirstRetrieveInitiated: ', voterFirstRetrieveInitiated);
      if (!voterFirstRetrieveInitiated) {
        AppObservableStore.setVoterFirstRetrieveInitiated(true);
        VoterActions.voterRetrieve();
      }
    });
  }

  render () {
    renderLog('SignInModalController');  // Set LOG_RENDER_EVENTS to log all renders
    const showSignInModal = AppObservableStore.showSignInModal();

    return (
      <div>
        {showSignInModal ? <SignInModal /> : null}
      </div>
    );
  }
}

export default SignInModalController;

