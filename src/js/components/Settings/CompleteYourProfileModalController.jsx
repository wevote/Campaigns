import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import CompleteYourProfileModal from './CompleteYourProfileModal';
import { renderLog } from '../../utils/logging';

class CompleteYourProfileModalController extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    // console.log('CompleteYourProfileModalController, componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    const showCompleteYourProfileModal = AppStore.showCompleteYourProfileModal();
    this.setState({
      showCompleteYourProfileModal,
    });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    const showCompleteYourProfileModal = AppStore.showCompleteYourProfileModal();
    this.setState({
      showCompleteYourProfileModal,
    });
  }

  closeModal () {
    AppActions.setShowCompleteYourProfileModal(false);
  }

  render () {
    renderLog('CompleteYourProfileModalController');  // Set LOG_RENDER_EVENTS to log all renders

    const { becomeMember, pathToUseWhenProfileComplete, startCampaign, supportCampaign } = this.props;
    const { showCompleteYourProfileModal } = this.state;
    return (
      <div>
        {showCompleteYourProfileModal && (
          <CompleteYourProfileModal
            becomeMember={becomeMember}
            closeFunction={this.closeModal}
            pathToUseWhenProfileComplete={pathToUseWhenProfileComplete}
            show={showCompleteYourProfileModal}
            startCampaign={startCampaign}
            supportCampaign={supportCampaign}
          />
        )}
      </div>
    );
  }
}
CompleteYourProfileModalController.propTypes = {
  becomeMember: PropTypes.bool,
  pathToUseWhenProfileComplete: PropTypes.string.isRequired,
  startCampaign: PropTypes.bool,
  supportCampaign: PropTypes.bool,
};

export default CompleteYourProfileModalController;
